const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {loadContacts,findContact,addContact,cekDuplikat,deleteContact} = require('./utils/contacts.js');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const app = express()
const port = 3000


app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded());

//middle ware config session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 6000 },
  })
);
//config flash
app.use(flash());
//config cookie
app.use(cookieParser('secret'));
 

app.get('/contact',(req,res)=>{
  const contacts = loadContacts();
  res.render('contact',{
  layout: 'layouts/main-layout',
  contacts,
  tittle : 'contact',
  msg : req.flash('msg')
});
});

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama : 'Ahmad',
      email : 'a.gmail.com'
    },
    {
      nama : 'Fahmi',
      email : 'sugati@gmail.com'
    }
  ]
  res.render('index', {
    layout : 'layouts/main-layout',
    tittle: 'HOME',
    mahasiswa});
});

//input validasi
app.post('/contact',[
    body('nama').custom((value)=>{
      const duplikat = cekDuplikat(value);
      if(duplikat){
        throw new Error('nama sudah di gunakan');
      }
      return true
    }),
    check('email','email tidak valid').isEmail(),
    check('nohp','format no_hp salah').isMobilePhone('id-ID')],
    (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      // return res.status(400).json({ errors: errors.array() });
      res.render('tambah',{ layout :'./layouts/main-layout',
      tittle : 'tambah data',
      errors : errors.array()
      })
    }else{
  
    addContact(req.body);
    req.flash('msg','data berhasil ditambahkan')
    res.redirect('/contact')
  }
})

// app.post('/contact/update',[
//   body('nama').custom((value)=>{
//     const duplikat = cekDuplikat(value);
//     if(duplikat){
//       throw new Error('nama sudah di gunakan');
//     }
//     return true
//   }),
//   check('email','email tidak valid').isEmail(),
//   check('nohp','format no_hp salah').isMobilePhone('id-ID')],
//   (req,res)=>{
//   const errors = validationResult(req);
//   if(!errors.isEmpty()){
//     // return res.status(400).json({ errors: errors.array() });
//     res.render('tambah',{ layout :'./layouts/main-layout',
//     tittle : 'tambah data',
//     errors : errors.array()
//     })
//   }else{

//   addContact(req.body);
//   req.flash('msg','data berhasil ditambahkan')
//   res.redirect('/contact')
// }
// })

app.post('/contact/update', [body('nama').custom((value)=>{
  const duplikat = cekDuplikat(value);
  if(duplikat){
    throw new Error('nama sudah digunakan')
  }
  return true
}),
check('email','email tidak valid').isEmail(),
check('nohp','format no_hp salah').isMobilePhone('id-ID')
],(req,res)=>{
  const errors = validationResult(req); 
  if(!errors.isEmpty()){
    // return res.status(400).json({ errors: errors.array() });
    const contact = findContact(req.body.nama)
    res.render('edit',{
      layout : './layouts/main-layout',
      tittle : 'edit data',
      errors : errors.array(),
      contact
    })
  } else {
    // updateContact(req.body.oldNama)
    // return redirect('/contact')
  }
})


app.get('/contact/edit/:nama',(req,res)=>{
  const contact = findContact(req.params.nama);
  res.render('edit',{
    layout : './layouts/main-layout',
    tittle :'edit data',
    contact,
  });
})

app.get('/contact/delete/:nama',(req,res)=>{
  const contacts = findContact(req.params.nama);
  if(!contacts){
    res.status(404);
    res.send('<h1>404</h1>')
  } else {
    deleteContact(req.params.nama);
    req.flash('msg','data berhasil dihapus')
    res.redirect('/contact')
  }
})

app.get('/contact/:nama',(req,res)=>{
  const contact = findContact(req.params.nama);

  res.render('detail',{
    layout : 'layouts/main-layout',
    tittle : 'detail',
    contact
  });
});


app.get('/tambah',(req,res)=>{
  res.render('tambah', {
    layout : 'layouts/main-layout',
    tittle : 'form tambah'
  })
})

app.get('/about',(req,res)=>{
  res.render('about',{layout: 'layouts/main-layout',
  tittle : 'about'});
});

app.get('/user',(req,res)=>{
  res.render('user',{layout: 'layouts/main-layout',
  tittle : 'user'});
});

app.get('/product/:id',(req,res)=>{
  res.send('product :'+ req.params.id + '<br>category :' + req.query.category )
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})