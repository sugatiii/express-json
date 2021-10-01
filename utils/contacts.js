const fs = require('fs');

const dirpath = './data';
if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath);
}

const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath,'[]','utf-8');
}

const loadContacts = ()=>{
    const fileBuffer = fs.readFileSync('./data/contacts.json','utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

const findContact = (nama)=>{
    const contacts = loadContacts();
    const contact = contacts.find((contact)=> contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
}

const saveContact = (contacts)=>{
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
}

const addContact = (contact)=>{
    const contacts = loadContacts();
    contacts.push(contact);
    saveContact(contacts);
}

const cekDuplikat = (nama)=>{
    const contacts = loadContacts();
    return contacts.find((contact)=> contact.nama === nama)
}

const deleteContact =(nama)=>{
    const contacts = loadContacts();
    const filterContact = contacts.filter((contact)=>contact.nama!==nama);
    saveContact(filterContact);
}

module.exports = {loadContacts,findContact, addContact,cekDuplikat,deleteContact};