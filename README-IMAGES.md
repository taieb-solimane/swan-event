# Where to put your photos

The site already looks for images at the exact paths below. Just save
your photos with these exact names in these exact folders — nothing
else needs to change. Until a photo is added, that spot shows an
elegant gold/teal placeholder instead of a broken image, so the site
always looks presentable while you're filling it in.

Recommended: export/compress images for web first (JPG, ~1600–2000px
on the long edge, under ~400KB each) so the page stays fast.

## Logo
```
images/logo/logo.png       → square logo, transparent background if possible
```

## Hero (top of page, full screen)
```
images/hero/hero-bg.jpg    → your single best, most impressive photo
                              (landscape, high resolution, min. 1920px wide)
```

## About section
```
images/about/about.jpg     → one signature decoration/setup photo (portrait works best, 4:5 ratio)
```

## Gallery — 4 photos per category (20 total)
```
images/gallery/mariages/1.jpg
images/gallery/mariages/2.jpg
images/gallery/mariages/3.jpg
images/gallery/mariages/4.jpg

images/gallery/fiancailles/1.jpg
images/gallery/fiancailles/2.jpg
images/gallery/fiancailles/3.jpg
images/gallery/fiancailles/4.jpg

images/gallery/corporate/1.jpg
images/gallery/corporate/2.jpg
images/gallery/corporate/3.jpg
images/gallery/corporate/4.jpg

images/gallery/buffet/1.jpg
images/gallery/buffet/2.jpg
images/gallery/buffet/3.jpg
images/gallery/buffet/4.jpg

images/gallery/inauguration/1.jpg
images/gallery/inauguration/2.jpg
images/gallery/inauguration/3.jpg
images/gallery/inauguration/4.jpg
```

Portrait photos (3:4) work best in the gallery grid. Want more or
fewer than 4 per category? Duplicate or delete an `<div class="gallery-item">`
block in `index.html` (search for `data-category="wedding"` etc.) —
each block is 4 lines and self-contained.

## That's it
Once the files are in place with these exact names, refresh the page —
every placeholder will automatically be replaced by your real photos.
