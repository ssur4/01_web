const unit = {
    attack : function (weapon) {
        return `${weapon} 으로 공격한다.`;
    }
};

console.log(unit);
console.log(unit.attack);
console.log(unit.attack('gun'));