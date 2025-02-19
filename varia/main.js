/*
import('../varia/module.js')
  .then(obj => {
    obj.hi('Пендальф');
  })
  .catch(err => {
    console.log(err.message);
  });
*/

async function load(){
  let say = await import('./module.js');

  say.hi("Пэндальф");
}

setTimeout(load, 2000);