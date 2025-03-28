//Files module

var fs = require('fs');

//appendFile creates new file if not found and add content if already present

fs.appendFile('mynewfile1.txt', 'Hello content! Test', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

//open files and check for second variable write or read

fs.open('mynewfile2.txt', 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved!');
});

//witeFile replaces the content if already data is present

fs.writeFile('mynewfile3.txt', 'Hello content!!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

//delete the file 

fs.unlink('mynewfile12.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});

fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});

fs.rename('myrenamedfile.txt', 'mynewfile1.txt', function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});