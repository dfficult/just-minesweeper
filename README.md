# 這就只是踩地雷
just minesweeper  

最新版本 -> [下載](https://github.com/dfficult/just-minesweeper/releases/latest)


### 簡介
這是一個Javascript小遊戲，讓你在沒有網路下也能玩  
第一下保證翻開至少9個空格  
有簡單的css動畫  


### 規則

翻開所有不是地雷的格子即可獲勝  
相反的，翻開任一顆地雷就輸了  

數字表示九宮格內有幾顆地雷  
例如，以下情況代表8個框內有兩個地雷  
▢ ▢ ▢  
▢ 2 ▢  
▢ ▢ ▢  
  
你可以使用旗子來標記地雷，方便思考  
每插上一個旗子，無論對或錯，上方的地雷剩餘數量都會減1  

遊戲自從你翻第一顆開始，會計時，點擊計時圖標可以暫停  
暫停時，你還是可以看到棋盤，但是無法翻開或插旗  

預設是9×9的棋盤，有10顆地雷(佔12%)  
你也可以按 ***[新遊戲]*** 按鈕或 ***[F2]*** 來選擇不同大小、不同地雷數量的棋盤  

### 遊玩按鍵

- ***左鍵*** - 翻開覆蓋的方格
- ***右鍵*** - (第一次) 插上旗子
               (第二次) 標記為問號
               (第三次) 取消標記
- ***左鍵按兩下/左右同時按*** - 快速翻開相鄰的空格(如果旗子不正確，可能會翻開地雷)
- ***F2*** - 開新遊戲(開啟棋盤調整選單)
- ***R*** - 開新遊戲(直接沿用棋盤大小、地雷設定)
- ***P*** - 暫停遊戲(或是點擊計時圖示)


###  下一個版本將新增的內容

- 音效
- 自訂顏色
- 更多語言
- 縮放(目前只能用瀏覽器的縮放功能)
- 可選擇"是否啟用動畫"
- 可選擇"是否啟用問號"
- 可選擇"是否啟用旗子"
- 可選擇"第一下開啟是否保證翻開至少9個空格"
- 紀錄
