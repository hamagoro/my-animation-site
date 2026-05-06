const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'movies.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

data.forEach(m => {
    // 1. キネマ旬報のフォーマット更新
    if (m.kinejun_rank === undefined || m.kinejun_rank === null || m.kinejun_rank === '-') {
        m.kinejun_rank = null;
    } else if (typeof m.kinejun_rank === 'string') {
        const match = m.kinejun_rank.match(/(\d{4})年度\s+(.+?)ベスト・テン\s+第(\d+)位/);
        if (match) {
            m.kinejun_rank = { 
                year: parseInt(match[1], 10), 
                category: match[2], 
                rank: parseInt(match[3], 10) 
            };
        } else {
            m.kinejun_rank = null;
        }
    }

    // 2. 賞歴のフォーマット更新
    if (m.awards_history === undefined || m.awards_history === null || m.awards_history === '-') {
        m.awards_history = { oscars: [], cannes: [], venice: [], berlin: [] };
    } else if (typeof m.awards_history === 'string') {
        const newAwards = { oscars: [], cannes: [], venice: [], berlin: [] };
        
        if (m.awards_history.includes('アカデミー賞')) {
            const match = m.awards_history.match(/アカデミー賞:\s*([^/]+)/);
            if (match) newAwards.oscars = match[1].replace(/受賞|ノミネート/g, '').split(/[、・]/).map(s => s.trim()).filter(s => s);
        }
        if (m.awards_history.includes('カンヌ')) {
            const match = m.awards_history.match(/カンヌ[^:]*:\s*([^/]+)/);
            if (match) newAwards.cannes = match[1].replace(/受賞|ノミネート/g, '').split(/[、・]/).map(s => s.trim()).filter(s => s);
        }
        if (m.awards_history.includes('ヴェネツィア') || m.awards_history.includes('ベネチア')) {
            const match = m.awards_history.match(/(?:ヴェネツィア|ベネチア)[^:]*:\s*([^/]+)/);
            if (match) newAwards.venice = match[1].replace(/受賞|ノミネート/g, '').split(/[、・]/).map(s => s.trim()).filter(s => s);
        }
        if (m.awards_history.includes('ベルリン')) {
            const match = m.awards_history.match(/ベルリン[^:]*:\s*([^/]+)/);
            if (match) newAwards.berlin = match[1].replace(/受賞|ノミネート/g, '').split(/[、・]/).map(s => s.trim()).filter(s => s);
        }
        
        m.awards_history = newAwards;
    }
});

// 3. 以前の更新でカメレオンマンの賞歴がマンハッタンに混入していた不具合を自動修復
const zelig = data.find(m => m.id === 142);
if (zelig && zelig.awards_history.venice.length === 0) {
    zelig.awards_history.venice = ["パシネッティ賞"];
    zelig.kinejun_rank = { year: 1984, category: "外国映画", rank: 5 };
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('movies.json のフォーマット一括更新が完了しました！');