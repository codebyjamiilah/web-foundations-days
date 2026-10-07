# SnapShare Scaling Plan

## Assumptions

- 10,000,000 registered users.
- 10% are active each day, so DAU = 10,000,000 x 0.10 = 1,000,000.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Average photo = 2 MB; each photo also gets a 50 KB thumbnail.
- 1 day = 86,400 seconds. Peak traffic = 5x the average.

## Estimates

**Uploads per second**
- Per day: 1,000,000 x 1 = 1,000,000 uploads.
- Average: 1,000,000 / 86,400 = about 12 uploads/s.
- Peak: 12 x 5 = about 58 uploads/s.

**Feed views per second**
- Per day: 1,000,000 x 50 = 50,000,000 views.
- Average: 50,000,000 / 86,400 = about 579 views/s.
- Peak: 579 x 5 = about 2,900 views/s.

**Storage per year**
- Per photo: 2 MB + 0.05 MB = 2.05 MB.
- Per day: 1,000,000 x 2.05 MB = about 2.05 TB.
- Per year: 2.05 TB x 365 = about 748 TB (roughly 0.75 PB).

## Read-heavy or write-heavy?

SnapShare is **read-heavy**. There are about 579 feed views per second
against 12 uploads per second, roughly 50 reads for every write.
So the design focuses on making reads fast and cheap: a CDN, a cache
and a read replica. Writes are rare and can take a little longer.

## Why photos are not stored in the database

Photos are large files. Storing them in the database would make it slow,
expensive and very hard to back up (about 748 TB per year). Instead,
photo files go in object storage, and the database stores only the
photo's URL and details such as the owner and upload time.

## Architecture diagram

```
        [ Users: phones and browsers ]
                     |
                     v
                 [  CDN  ]  <---- serves photos and thumbnails
                     |            (reads from object storage if not cached)
                     v
             [ Load Balancer ]
              /      |      \
             v       v       v
        [App 1]  [App 2]  [App 3]      (app servers)
          |  |      |        |
          |  +------+--------+------> [ Cache ]  (feeds, user info)
          |
          +--> writes ---------------> [ Database (primary) ]
          |                                  |
          +--> reads  <--- [ Read Replica ] <-+  (copy of primary)
          |
          +--> upload file ----------> [ Object Storage ]  (photos + thumbnails)
          |                                   ^
          +--> "make thumbnail" job           |
                     |                        |
                     v                        |
                 [ Queue ] ---> [ Thumbnail Worker ]
                                 (reads original, saves thumbnail)
```

## What each component does

- **CDN:** solves slow loading for faraway users by keeping copies of photos close to them.
- **Load balancer:** solves one server being overloaded by spreading requests across many app servers.
- **App servers:** solve the need to run the app's logic (login, feed, upload) at scale, because we can add more of them.
- **Cache:** solves repeated slow database reads by keeping popular data, like a feed, in fast memory.
- **Database (primary):** solves safe, organised storage of users, follows and photo details.
- **Read replica:** solves the read-heavy load by handling feed reads so the primary can focus on writes.
- **Object storage:** solves the problem of storing huge numbers of large photo files cheaply and reliably.
- **Queue:** solves slow work blocking the user by holding thumbnail jobs until a worker is free.
- **Thumbnail worker:** solves slow feed loading by creating small 50 KB images in the background.

## Upload flow

1. The user picks a photo in the app and taps Upload.
2. The request goes through the CDN to the load balancer.
3. The load balancer sends it to one app server.
4. The app server checks the user is logged in and the file is valid.
5. The app server saves the original photo (2 MB) to object storage.
6. The app server saves a row in the database primary with the photo's URL, owner and time.
7. The app server puts a "create thumbnail" job on the queue.
8. The app server replies "Upload successful" straight away.
9. The thumbnail worker takes the job from the queue, reads the original from object storage, makes a 50 KB thumbnail and saves it back to object storage.
10. The worker updates the database so the photo shows its thumbnail.
11. The cache entries for followers' feeds are refreshed or expire, so the photo appears in their feeds.

## Trade-offs

1. **Cache speed vs fresh data:** the cache makes feeds fast, but it can show slightly old data. A new photo may take a few seconds to appear. We accept this because speed matters more.
2. **Read replica lag:** the replica copies the primary with a small delay, so a user might not see their own new post instantly. We accept this to spread the read load.
3. **Queue makes uploads faster but thumbnails late:** the user gets a quick reply, but the thumbnail appears a few seconds later.
4. **More components, more cost and complexity:** a CDN, cache, queue and replicas make the system faster but cost more and are harder to run and fix.