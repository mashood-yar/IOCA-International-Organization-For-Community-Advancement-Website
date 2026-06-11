const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else if(file.endsWith('.tsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('src');
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace hardcoded <p className="..."> with dynamic template literal including isUrdu logic
    // Targeting typical subtitle paragraphs like: <p className="text-brand-navy/60 text-base md:text-lg max-w-2xl">
    content = content.replace(/<p className="(text-[^"]*max-w-[^"]*)">/g, '<p className={`$1 ${isUrdu ? \'font-urduBody\' : \'\'}`}>');
    
    if(content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
        updatedCount++;
    }
});

console.log(`Updated ${updatedCount} files.`);
