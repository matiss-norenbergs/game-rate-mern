const RankCalc = (reviewCount) => {
    const rankDif = 3;
    if(reviewCount % rankDif === 0){
        return reviewCount / rankDif;
    }else{
        const leftOver = reviewCount % rankDif;
        return (reviewCount - leftOver) / rankDif;
    }
}
 
export default RankCalc;