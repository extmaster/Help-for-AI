const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'sections');
const assetsDir = path.join(__dirname, 'assets');
const sectionListFile = path.join(assetsDir, 'section-list.js');

try {
    // 1. Read all filenames from the 'sections' directory
    const files = fs.readdirSync(sectionsDir)
        .filter(file => file.endsWith('.html'))
        .sort(); // Sort alphabetically

    // 2. Create a mapping of filename to a readable name
    const sectionData = files.map(file => {
        // '01-concepts.html' -> 'Concepts'
        // '02-zed-editor.html' -> 'Zed Editor'
        const name = file
            .replace('.html', '')
            .replace(/^\d+-/, '') // Remove leading numbers like '01-'
            .replace(/-/g, ' ')   // Replace hyphens with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word

        return {
            file: file,
            name: name
        };
    });

    // 3. Format the data as a JavaScript variable
    const fileContent = `const sections = ${JSON.stringify(sectionData, null, 4)};`;

    // 4. Write the array to 'assets/section-list.js'
    fs.writeFileSync(sectionListFile, fileContent, 'utf8');

    console.log(`Successfully generated section-list.js with ${sectionData.length} sections.`);

} catch (error) {
    console.error('Failed to build section list:', error);
    // Create an empty file on error to prevent site from breaking
    if (!fs.existsSync(sectionListFile)) {
        fs.writeFileSync(sectionListFile, 'const sections = [];', 'utf8');
    }
}
