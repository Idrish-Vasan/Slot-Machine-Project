//1. Deposit Money
//2. Determine number of lines bet on
//3. Collect a bet money
//4. Spin the slot machine
//5. Check if the user won
//6. Give user theri winnings
//7. Play Again

const prompt=require('prompt-sync')();

const rows=3;
const cols=3;
const Symbol_count={
  Cherry:2,
  Lemon:4,
  Orange:6,
  Plum:8,
  Bell:3,
  Bar:5,
  7:5
};
const Symbol_values={
  Cherry:50,
  Lemon:20,
  Orange:25,
  Plum:14,
  Bell:10,
  Bar:5,
  7:100,
}
const deposit=()=>{
  const depositAmount = prompt('How much would you like to deposit? :');
  const numberAmount=parseFloat(depositAmount);

  if (isNaN(numberAmount)||numberAmount<=0){
    console.log('Please enter a valid number');
    return deposit();
  }else{
    return numberAmount;
  }

};

const getNumberOfLines=()=>{
  const lines = prompt('Enter number of lines to bet(1-3) :');
  const numberofLines=parseFloat(lines);

  if (isNaN(numberofLines)||numberofLines<=0||numberofLines>3){
    console.log('Invalid number of lines. Please enter a number between 1 and 3');
    return getNumberOfLines();
  }else{
    return numberofLines;
  }
};

const getBet=(balance,lines)=>{
  const bet = prompt('Enter bet per line :');
  const totalbet=parseFloat(bet);

  if (isNaN(totalbet)||totalbet<=0||totalbet>(balance/lines)){
    console.log('Invalid bet.Enter again.');
    return getBet();
  }else{
    return totalbet;
  }
};

const spin=()=>{
  const symbols=[];
  for (const[symbol,count] of Object.entries(Symbol_count)){
    for (let i=0;i<count;i++){
      symbols.push(symbol);
    }
  }

  const reels=[];
  for(let i=0;i<cols;i++){
    reels.push([]);
    const reelSymbol=[...symbols];
    for(let j=0;j<rows;j++){
      const randomIndex=Math.floor(Math.random()*reelSymbol.length);
      const selectedSymbol=reelSymbol[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbol.splice(randomIndex,1);
    }
  }
  return reels;
};

const transpose=(reels)=>{
  const ROWS=[];
  for(let i=0;i<rows;i++){
    ROWS.push([]);
    for(let j=0;j<cols;j++){
      ROWS[i].push(reels[j][i]);
      // rows[i][j]=reels[j][i];
    }
  }
  return ROWS;
};

const printRows=(ROWS)=>{

  const COLUMN_WIDTH = 10; 
  const formattedRows = ROWS.map(row =>
    row.map(symbol => symbol.padStart((COLUMN_WIDTH - symbol.length) / 2 + symbol.length, ' ').padEnd(COLUMN_WIDTH, ' ')).join('|')
  );
  formattedRows.forEach(row => console.log(row));
};

const getWinningAmount=(ROWS,bet,lines)=>{
  let winnings=0;
  for(let row=0;row<lines;row++){
    const symbols=ROWS[row];
    let allSame=true;
    for(const symbol of symbols){
      if(symbol!=symbols[0]){
        allSame=false;
        break;
      }
    } 
    if(allSame){
      winnings+=Symbol_values[symbols[0]]*bet;
    }
  }
  return winnings;
}

const game=()=>{
  let balance=deposit();
  while(true){
    console.log('Your balance is $'+balance.toString()); 
    const numberofLines=getNumberOfLines();
    const bet=getBet(balance,numberofLines);
    balance-=bet*numberofLines;  
    const reels=spin();
    const rowt=transpose(reels);
    printRows(rowt);
    const winnings=getWinningAmount(rowt,bet,numberofLines);
    console.log('You won $'+winnings.toString());
    balance+=winnings;
    console.log('Your balance is $'+balance.toString());
    if(balance<=0){
      console.log('You are out of money. Game Over!'); 
      break;
    }
    const playAgain=prompt('Do you want to play again? (y/n) :');
    if(playAgain!='y'){
      console.log("Thanks for playing!");
      break;
    }
  }

};
game();