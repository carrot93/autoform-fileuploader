Package.describe({
  name: 'shjiaye:autoform-fileuploader',
  version: '0.1.1',
  summary: 'Yet another filuploader for autoform',
  git: 'https://github.com/ksrv/autoform-fileuploader',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use('templating');
  api.use('underscore');

  api.use('cfs:standard-packages@0.5.9',  ['client']);
  api.use('aldeed:autoform@5.8.1',        ['client']);
  api.use('cfs:http-methods@0.0.32',      ['client','server']);
  api.use('cfs:access-point@0.1.49',      ['client','server']);
  

  api.addFiles('file.css',  ['client']);
  api.addFiles('file.html', ['client']);
  api.addFiles('file.js',   ['client']);

  api.addFiles('file-server.js', ['server']);
});
