---
layout: post
title: "Scribus and Huge PDF File Sizes"
date: 2013-08-14 12:03:43
---

A bit of a niche subject here. If you use Scribus, the open source publishing software, and you export your document to a PDF, chances are the PDF might be a gazillion megabytes. Now, this might not matter to you, but say you're uploading to HP's MagCloud, which only takes files 300 megabytes and smaller. Once you finally finish laying everything out in Scribus, and such a barrier comes up, it might just make you punch your computer. Don't! Until you try the solution below.

You might try using Preview's 'reduce' filter, which makes every picture look like you've just woken up, with a hangover, after someone smeared Vaseline on your eyes, and then punched you in the stomach. And that's not good if you're trying to print some nice pictures.

You might go through your entire Scribus file, cropping the images and editing them to be only the size that you've displayed, because, like some hoarder, Scribus saves the entire image no matter how little of it you use. But that would take forever.

You might attempt some weird scripts within Scribus while using GhostScript. You copy and paste them from the Scribus Wiki, but nothing moves.

You might try importing your PDF into InDesign, but learn that that will take buying conversion software, and avoiding spending money was what led you to use Scribus in the first place.

You might learn that one reason why Scribus PDF's are so huge is because Scribus, instead of saving position information for each *line* of text, it saves the position of each *letter*, which makes it horribly accurate - but as a good trail work friend says, \"we're not putting this in the air,\" meaning there's little need for such accuracy.

The solution: download the free trial of Adobe Acrobat. I know, you've avoided it all your life, using weird looking PDF viewers instead, but... the company knows PDFs. Open up your gargantuan PDF that Scribus spit out (600MB for me), save as a reduced size PDF, and Acrobat will deliver a shiny looking PDF at a much more manageable size (down to 15MB for me!).
