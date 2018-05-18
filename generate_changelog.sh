#!/bin/bash

earliest_changelog_commit=7f4afda
commit_hash_regex='[0-9a-f]\{7\}'

# get all commit messages (first line only)
git log --oneline ${earliest_changelog_commit}..master |\

# replace newlines because we want builds to be referenced by the hash of the latest commit, not the newly generated one
tr '\n' @ |\

# fix html special characters (according to php's htmlspecialchars())
sed -e "s/&/\&amp;/g;s/\"/\&quot;/g;s/'/\&#039;/g;s/</\&lt;/g;s/>/\&gt;/g" |\

# prepend string so the following regexes apply to the first line too
sed -e 's/^/Build@/' |\

# split at each 'Build' commit with a <p>
sed -e "s#Build@\\(${commit_hash_regex}\\) #</li></ul></p>@<p>Build \1<ul>@<li>#g" |\

# split at every other commit with <li>
sed -e "s#@${commit_hash_regex} *#</li>@<li>#g" |\

# append trailing junk
sed -e 's#@$#</li>@</ul></p>#' |\

# truncate leading junk
tail -c +15 |\

# delete more fluff that got left behind
sed -e 's#<li></li>##g' |\

# put newlines back in for better diffs when committing to git
tr @ '\n' |\

# output
cat
