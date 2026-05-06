const fs = require('fs');
const path = require('path');

// 1. ファイルパスの設定
const targetFilePath = path.join(__dirname, 'movies.json'); // 更新対象のメインデータ
const updatesFilePath = path.join(__dirname, 'updates.json'); // 読み込む更新データ
const backupDir = path.join(__dirname, 'backups'); // バックアップ用フォルダ

// 2. 更新用データ(updates.json)の存在確認と読み込み
if (!fs.existsSync(updatesFilePath)) {
    console.error('エラー: 更新データファイル (updates.json) が見つかりません。');
    process.exit(1);
}
const updates = JSON.parse(fs.readFileSync(updatesFilePath, 'utf8'));

// 3. バックアップフォルダが存在しない場合は自動作成
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// 4. 現在の日時を取得してファイル名を作成
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const min = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
const timestamp = `${yyyy}${mm}${dd}_${hh}${min}${ss}`;

const backupFilePath = path.join(backupDir, `movies_backup_${timestamp}.json`);

// 5. 書き換えの前にバックアップをコピーして退避
if (fs.existsSync(targetFilePath)) {
    fs.copyFileSync(targetFilePath, backupFilePath);
    console.log(`バックアップを保存しました: ${backupFilePath}`);
} else {
    console.error('エラー: 元の movies.json が見つかりません。処理を中断します。');
    process.exit(1);
}

// 6. 既存の movies.json を読み込む
let movies = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));

// 7. データのマージ（統合）処理
let updatedCount = 0;
movies.forEach(movie => {
    // updates.json の中から、同じidを持つデータを探す
    const updateInfo = updates.find(u => u.id === movie.id);
    
    if (updateInfo) {
        // updateInfo側にキーが存在する場合のみ上書きする（安全対策）
        if (updateInfo.kinejun_rank !== undefined) {
            movie.kinejun_rank = updateInfo.kinejun_rank;
        }
        if (updateInfo.awards_history !== undefined) {
            movie.awards_history = updateInfo.awards_history;
        }
        updatedCount++;
    }
});

// 8. movies.json を上書き保存
fs.writeFileSync(targetFilePath, JSON.stringify(movies, null, 2), 'utf8');
console.log(`${updatedCount}件の映画データに、最新の情報をマージしました！`);