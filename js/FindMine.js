let mine={};
let replace = [[0,'0️⃣'],[1,'1️⃣'],[2,'2️⃣'],[3,'3️⃣'],[4,'4️⃣'],[5,'5️⃣'],[6,'6️⃣'],[7,'7️⃣'],[8,'8️⃣'],['m','🧨'],['n','🟦'],['g','⚠️'],['p','🎉']];

let FindMine = {
    // showMap : function() {
    //     if(!mine.status) return 'This game is not started';
    //     let result = [];
    //     for(let i=0;i<mine.player.length;i++) {
    //         result[i]='';
    //         for(let j=0;j<mine.player[i].length;j++) {
    //             if(mine.guess.find(e=>e[0]==i&&e[1]==j)) result[i]+=replace[11][1];
    //             else result[i]+=replace[replace.findIndex(a=>a[0]==mine.player[i][j])][1];
    //         }
    //     }
    //     return result.join('\n');
    // },
    showMap : function() {
        if(!mine.status) return 'This game is not started';
        let num = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
        let result = ['⬛'.repeat(2),'⬛'.repeat(11)];
        for(let i=0;i<num.length;i++) result[0]+=num[i];
        for(let i=0;i<9;i++) {
            result[i+2]=num[i]+'⬛';
//            for(let j=0;j<9;j++) result[i+2]+=replace[replace.findIndex(a=>a[0]==mine.player[i][j])][1];
            for(let j=0;j<9;j++) result[i+2]+=replace[replace.findIndex(a=>a[0]==(mine.guess.find(e=>e[0]==i&&e[1]==j)?'g':mine.player[i][j]))][1];
        }
        return result.join('\n');
    },
    showMines : function() {
        if(!mine.status) return 'This game is not started';
        let result = [];
        for(let i=0;i<mine.map.length;i++) {
            result[i]='';
            for(let j=0;j<mine.map[i].length;j++) result[i]+=replace[replace.findIndex(a=>a[0]==mine.map[i][j])][1];
        }
        return result.join('\n');
    },
    gameover : function() {
        if(!mine.status) return 'This game is not started';
        for(let i=0;i<mine.map.length;i++) for(let j=0;j<mine.map[i].length;j++) if(mine.map[i][j]=='m') mine.player[i][j]='m';
        mine={};
        return 'Game Over!';
    },
    guessMine : function(i,j) {
        if(!mine.status) return 'This game is not started\n'+this.showMap();
        if(isNaN(i) || isNaN(j)) return 'Please input number\n'+this.showMap();
        if(i<0 || i>mine.map.length-1 || j<0 || j>mine.map.length-1) return 'Invailed location\n'+this.showMap();
        if(!mine.guess.find(e=>e[0]==i&&e[1]==j)) {
            mine.guess.push([i,j]);
            return "Guess added!\n"+this.showMap();
        } else {
            mine.guess.splice(mine.guess.findIndex(e=>e==[i,j]),1);
            return "Guess removed!\n"+this.showMap();
        }
    },
    setMines : function(size,mines) {
        if(mine.status) return 'This game is already started';
        if(size<9) return 'Size is too small';
        mine = {
            'status':false,
            'player':[],
            'map':[],
            'mine_len':mines,
            'mine_locate':[],
            'clear':[],
            'guess':[]
        }
        //SET SIZE
        for(let i=0;i<size;i++) {
            mine.player[i]=[];
            mine.map[i]=[];
            for(let j=0;j<size;j++) {
                mine.map[i][j]=0;
                mine.player[i][j]='n';
            }
        }
        //SET MINES
        for(let i=0;i<mines;i++) {
            let tmp1=Math.random()*9|0;
            let tmp2=Math.random()*9|0;
            if(mine.map[tmp1][tmp2]=='m') i--;
            else {
                mine.map[tmp1][tmp2]='m';
                for(let j=-1;j<2;j++) {
                    for(let k=-1;k<2;k++) {
                        if(tmp1+j>-1 && tmp1+j<size && tmp2+k>-1 && tmp2+k<size && mine.map[tmp1+j][tmp2+k]!='m') mine.map[tmp1+j][tmp2+k]++;
                        else continue;
                    }
                }
            }
        }
        //SET GAME CLEAR
        for(let i=0;i<size;i++) {
            mine.clear[i]=[];
            for(let j=0;j<size;j++) mine.clear[i].push(mine.map[i][j]=='m'?'n':mine.map[i][j]);
        }
        mine.status=true;
        return true;
    },
    findMines : function(i,j,re) {
        re=undefined||null?false:re;
        if(!mine.status) return 'This game is not started\n'+this.showMap();
        if(isNaN(i) || isNaN(j)) return 'Please input number\n'+this.showMap();
        if(i<0 || i>mine.map.length-1 || j<0 || j>mine.map.length-1) return 'Invailed location\n'+this.showMap();
        if(mine.guess.find(e=>e[0]==i&&e[1]==j)) return 'You cannot select where you guessed.\n'+this.showMap();
        if(mine.player[i][j]!='n') return 'Already Selected\n'+this.showMap();
        let nomine=true;
        let tmp1=i,tmp2=j;
        if(mine.map[i][j]=='m') {
            for(let i=0;i<mine.map.length;i++) for(let j=0;j<mine.map[i].length;j++) if(mine.map[i][j]=='m') mine.player[i][j]='m';
            tmp = this.showMap();
            mine={};
            return 'Game Over!\n'+tmp;
        } else {
            mine.player[i][j]=mine.map[i][j];
            for(let j=-1;j<2;j++) {
                for(let k=-1;k<2;k++) {
                    if(tmp1+j<0 || tmp1+j>mine.player[0].length-1 || tmp2+k<0 && tmp2+k>mine.player[0].length-1 && mine.player[tmp1+j][tmp2+k]!='n') continue;
                    if(mine.map[tmp1+j][tmp2+k]=='m') nomine=false;
                }
            }
            if(nomine) {
                for(let j=-1;j<2;j++) {
                    for(let k=-1;k<2;k++) {
                        if(tmp1+j<0 || tmp1+j>mine.player[0].length-1 || tmp2+k<0 && tmp2+k>mine.player[0].length-1 && mine.player[tmp1+j][tmp2+k]!='n') continue;
                        if(nomine) this.findMines(tmp1+j,tmp2+k,true);
                    }
                }
            }
            // if(!re) continue;
        }
        if(JSON.stringify(mine.player)==JSON.stringify(mine.clear)) {
            for(let i=0;i<mine.map.length;i++) for(let j=0;j<mine.map[i].length;j++) if(mine.map[i][j]=='p') 
            tmp = this.showMap();
            mine={};
            return "Congratulations! You have found all mines!\n"+tmp;
        } else return this.showMap();
    }
}

let HTML = {
    edit : function(str) {
        let element = document.getElementById("findmine")
        return element.innerText=str;
    },
    start : function() {
        FindMine.setMines(9,10);
        this.edit(FindMine.showMap());
    },
    reset : function() {
        FindMine.gameover();
        FindMine.setMines(9,10);
        this.edit(`Resetted Game!\n${FindMine.showMap()}`);
    },
    find : function() {
        let x = document.getElementById('x').value;
        let y = document.getElementById('y').value;
        this.edit(FindMine.findMines(x-1,y-1));
    },
    guess : function() {
        let x = document.getElementById('x').value;
        let y = document.getElementById('y').value;
        this.edit(FindMine.guessMine(x-1,y-1));
    }
}