const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'movies.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. ケンとカズ(id:16) と パラサイト(id:27) のデータを移植・リセット
const kenkazu = data.find(m => m.id === 16);
const parasite = data.find(m => m.id === 27);

if (kenkazu && parasite && kenkazu.kinejun_rank && kenkazu.kinejun_rank.category === "外国映画") {
    // ケンとカズに入ってしまったパラサイトのデータを正しい場所へ
    parasite.kinejun_rank = kenkazu.kinejun_rank;
    parasite.awards_history = kenkazu.awards_history;
    // ケンとカズのデータを初期化
    kenkazu.kinejun_rank = null;
    kenkazu.awards_history = { oscars: [], cannes: [], venice: [], berlin: [] };
}

// 2 & 3. 分割エラーの修復と、万引き家族のアカデミー賞修正
data.forEach(m => {
    // 「パルム」と「ドール」の結合
    if (m.awards_history && m.awards_history.cannes) {
        const cannes = m.awards_history.cannes;
        if (cannes.includes('パルム') && cannes.includes('ドール')) {
            m.awards_history.cannes = cannes.filter(a => a !== 'パルム' && a !== 'ドール');
            m.awards_history.cannes.push('パルム・ドール');
        }
    }
    
    // 万引き家族(id:28)のアカデミー外国語映画賞(ノミネート)を除外
    // ※ノミネートも残したい場合は、以下の if文 を丸ごと削除してください
    if (m.id === 28 && m.awards_history && m.awards_history.oscars) {
        m.awards_history.oscars = m.awards_history.oscars.filter(a => a !== '外国語映画賞');
    }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('データのズレとパルム・ドールの分割エラーを修正しました！');
