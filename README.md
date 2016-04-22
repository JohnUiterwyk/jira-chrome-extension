jira-chrome-extension
======
A chrome extension to make it easier to work with JIRA
Setup
-----
```
npm install -g gulp
npm install -g bower
npm install
bower install
```

Compile
------
gulp is setup with a file watcher that will compile as you work
```
gulp
```
to force a build run:
```
gulp build
```

Deploy
------
```
gulp zip
```
This will create `deploy/jira-chrome-extension.zip` then upload to Chrome Store developer dashboard; be sure to increment the version in build/manifest.json