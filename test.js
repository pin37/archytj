var str = 'button onClick="dostuff(\'>\');"></button>';
console.log(str.replace(/<(?:.|\n)*?>/gm, ''));