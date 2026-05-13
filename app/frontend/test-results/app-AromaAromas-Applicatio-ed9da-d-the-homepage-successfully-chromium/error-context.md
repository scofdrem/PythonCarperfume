# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> AromaAromas Application >> Homepage >> should load the homepage successfully
- Location: tests\e2e\app.spec.ts:14:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header, nav')
Expected: visible
Error: strict mode violation: locator('header, nav') resolved to 2 elements:
    1) <header data-mgx-text="" data-mgx-line="16" data-mgx-tag="header" data-mgx-project="jsx" data-mgx-start-column="4" data-mgx-path="frontend\\src\\components\\Header.tsx" data-mgx-id="frontend\\src\\components\\Header.tsx:16:4" class="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#C69B56]/20" data-mgx-component="%20%20%20%20%3Cheader%20className%3D%22fixed%20top-0%20left-0%20right-0%20z-50%20bg-black%2F95%20backdrop-blur-sm%20border-b%20border-%5B%23C69B56%5D%2F20%22%3E%0…>…</header> aka getByRole('banner')
    2) <nav data-mgx-text="" data-mgx-line="45" data-mgx-tag="nav" data-mgx-project="jsx" data-mgx-start-column="10" class="hidden sm:flex items-center gap-8" data-mgx-path="frontend\\src\\components\\Header.tsx" data-mgx-id="frontend\\src\\components\\Header.tsx:45:10" data-mgx-component="%20%20%20%20%20%20%20%20%20%20%3Cnav%20className%3D%22hidden%20sm%3Aflex%20items-center%20gap-8%22%3E%0D">…</nav> aka getByText('КаталогБрендыО нас')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('header, nav')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e6]:
        - link "1000 АРОМАТОВ 1000 АРОМАТОВ ПАРФЮМ НА РАСПИВ" [ref=e7] [cursor=pointer]:
          - /url: /
          - img "1000 АРОМАТОВ" [ref=e8]
          - generic [ref=e9]:
            - generic [ref=e10]: 1000 АРОМАТОВ
            - generic [ref=e11]: ПАРФЮМ НА РАСПИВ
        - navigation [ref=e12]:
          - link "Каталог" [ref=e13] [cursor=pointer]:
            - /url: /catalogue
          - link "Бренды" [ref=e14] [cursor=pointer]:
            - /url: /catalogue?tab=brands
          - link "О нас" [ref=e15] [cursor=pointer]:
            - /url: /#about
    - main [ref=e16]:
      - generic [ref=e17]:
        - img "Luxury perfumes" [ref=e19]
        - generic [ref=e23]:
          - img "1000 Ароматов" [ref=e25]
          - paragraph [ref=e26]: ПАРФЮМ НА РАСПИВ
          - heading "Мир элитных ароматов" [level=1] [ref=e27]:
            - text: Мир элитных
            - text: ароматов
          - paragraph [ref=e28]: Откройте для себя коллекцию нишевых и люксовых парфюмов в формате отливантов. Попробуйте легендарные ароматы от 2 мл.
          - link "Смотреть каталог" [ref=e29] [cursor=pointer]:
            - /url: /catalogue
      - generic [ref=e32]:
        - heading "Категории" [level=2] [ref=e34]
        - generic [ref=e36]:
          - link "Отливанты Отливанты" [ref=e37] [cursor=pointer]:
            - /url: /catalogue?category=decants
            - img "Отливанты" [ref=e38]
            - heading "Отливанты" [level=3] [ref=e41]
          - link "Женская Женская" [ref=e42] [cursor=pointer]:
            - /url: /catalogue?category=women
            - img "Женская" [ref=e43]
            - heading "Женская" [level=3] [ref=e46]
          - link "Мужская Мужская" [ref=e47] [cursor=pointer]:
            - /url: /catalogue?category=men
            - img "Мужская" [ref=e48]
            - heading "Мужская" [level=3] [ref=e51]
          - link "Нишевая Нишевая" [ref=e52] [cursor=pointer]:
            - /url: /catalogue?category=niche
            - img "Нишевая" [ref=e53]
            - heading "Нишевая" [level=3] [ref=e56]
          - link "Люксовая Люксовая" [ref=e57] [cursor=pointer]:
            - /url: /catalogue?category=luxury
            - img "Люксовая" [ref=e58]
            - heading "Люксовая" [level=3] [ref=e61]
          - link "Унисекс Унисекс" [ref=e62] [cursor=pointer]:
            - /url: /catalogue?category=unisex
            - img "Унисекс" [ref=e63]
            - heading "Унисекс" [level=3] [ref=e66]
      - generic [ref=e68]:
        - generic [ref=e69]:
          - heading "Хиты продаж" [level=2] [ref=e71]
          - link "Все ароматы →" [ref=e73] [cursor=pointer]:
            - /url: /catalogue
        - generic [ref=e74]:
          - generic [ref=e75]:
            - img "Bois Imperial" [ref=e77]
            - generic [ref=e78]:
              - paragraph [ref=e79]: Essential Parfums
              - heading "Bois Imperial" [level=3] [ref=e80]
              - generic [ref=e81]:
                - button "5 мл" [ref=e82] [cursor=pointer]
                - button "10 мл" [ref=e83] [cursor=pointer]
                - button "15 мл" [ref=e84] [cursor=pointer]
                - button "20 мл" [ref=e85] [cursor=pointer]
                - button "25 мл" [ref=e86] [cursor=pointer]
                - button "30 мл" [ref=e87] [cursor=pointer]
              - button "Уточнить наличие" [ref=e88] [cursor=pointer]:
                - img [ref=e89]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e91] [cursor=pointer]:
                - generic [ref=e92]: Подробнее
                - img [ref=e93]
              - generic [ref=e95]:
                - paragraph [ref=e96]: Древесный унисекс-аромат с яркими нотами бобов тонка, ветивера и амброксана. Идеальный выбор для тех, кто ценит элегантность и утончённость в каждом вдохе.
                - link "Обзор в Instagram" [ref=e97] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e98]
                  - text: Обзор в Instagram
          - generic [ref=e101]:
            - img "This is Her!" [ref=e103]
            - generic [ref=e104]:
              - paragraph [ref=e105]: Zadig & Voltaire
              - heading "This is Her!" [level=3] [ref=e106]
              - generic [ref=e107]:
                - button "5 мл" [ref=e108] [cursor=pointer]
                - button "10 мл" [ref=e109] [cursor=pointer]
                - button "15 мл" [ref=e110] [cursor=pointer]
                - button "20 мл" [ref=e111] [cursor=pointer]
                - button "25 мл" [ref=e112] [cursor=pointer]
                - button "30 мл" [ref=e113] [cursor=pointer]
              - button "Уточнить наличие" [ref=e114] [cursor=pointer]:
                - img [ref=e115]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e117] [cursor=pointer]:
                - generic [ref=e118]: Подробнее
                - img [ref=e119]
              - generic [ref=e121]:
                - paragraph [ref=e122]: Роковой женский аромат с нотами розового перца, жасмина и кашемирового дерева. Чувственный и современный, он подчёркивает индивидуальность.
                - link "Обзор в Instagram" [ref=e123] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e124]
                  - text: Обзор в Instagram
          - generic [ref=e127]:
            - img "Atelier des Fleurs Cedrus" [ref=e129]
            - generic [ref=e130]:
              - paragraph [ref=e131]: Chloé
              - heading "Atelier des Fleurs Cedrus" [level=3] [ref=e132]
              - generic [ref=e133]:
                - button "5 мл" [ref=e134] [cursor=pointer]
                - button "10 мл" [ref=e135] [cursor=pointer]
                - button "15 мл" [ref=e136] [cursor=pointer]
                - button "20 мл" [ref=e137] [cursor=pointer]
                - button "25 мл" [ref=e138] [cursor=pointer]
                - button "30 мл" [ref=e139] [cursor=pointer]
              - button "Уточнить наличие" [ref=e140] [cursor=pointer]:
                - img [ref=e141]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e143] [cursor=pointer]:
                - generic [ref=e144]: Подробнее
                - img [ref=e145]
              - generic [ref=e147]:
                - paragraph [ref=e148]: Изысканный цветочный аромат от Chloé с нотами кедра и пионов. Нежный и утончённый, он переносит в атмосферу цветущего сада.
                - link "Обзор в Instagram" [ref=e149] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e150]
                  - text: Обзор в Instagram
          - generic [ref=e153]:
            - img "Angel's Share" [ref=e155]
            - generic [ref=e156]:
              - paragraph [ref=e157]: By KILIAN
              - heading "Angel's Share" [level=3] [ref=e158]
              - generic [ref=e159]:
                - button "5 мл" [ref=e160] [cursor=pointer]
                - button "10 мл" [ref=e161] [cursor=pointer]
                - button "15 мл" [ref=e162] [cursor=pointer]
                - button "20 мл" [ref=e163] [cursor=pointer]
                - button "25 мл" [ref=e164] [cursor=pointer]
                - button "30 мл" [ref=e165] [cursor=pointer]
              - button "Уточнить наличие" [ref=e166] [cursor=pointer]:
                - img [ref=e167]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e169] [cursor=pointer]:
                - generic [ref=e170]: Подробнее
                - img [ref=e171]
              - generic [ref=e173]:
                - paragraph [ref=e174]: Тёплый коньячный аромат с нотами корицы, дуба и пралине. Вдохновлён ирландскими традициями вискикурения — роскошь в каждой капле.
                - link "Обзор в Instagram" [ref=e175] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e176]
                  - text: Обзор в Instagram
          - generic [ref=e179]:
            - img "Spiky Muse" [ref=e181]
            - generic [ref=e182]:
              - paragraph [ref=e183]: Ex Nihilo
              - heading "Spiky Muse" [level=3] [ref=e184]
              - generic [ref=e185]:
                - button "5 мл" [ref=e186] [cursor=pointer]
                - button "10 мл" [ref=e187] [cursor=pointer]
                - button "15 мл" [ref=e188] [cursor=pointer]
                - button "20 мл" [ref=e189] [cursor=pointer]
                - button "25 мл" [ref=e190] [cursor=pointer]
                - button "30 мл" [ref=e191] [cursor=pointer]
              - button "Уточнить наличие" [ref=e192] [cursor=pointer]:
                - img [ref=e193]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e195] [cursor=pointer]:
                - generic [ref=e196]: Подробнее
                - img [ref=e197]
              - generic [ref=e199]:
                - paragraph [ref=e200]: Дерзкий и провокационный аромат с нотами чёрной смородины, розы и пачули. Для тех, кто не боится выделяться из толпы.
                - link "Обзор в Instagram" [ref=e201] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e202]
                  - text: Обзор в Instagram
          - generic [ref=e205]:
            - img "Toy 2" [ref=e207]
            - generic [ref=e208]:
              - paragraph [ref=e209]: Moschino
              - heading "Toy 2" [level=3] [ref=e210]
              - generic [ref=e211]:
                - button "5 мл" [ref=e212] [cursor=pointer]
                - button "10 мл" [ref=e213] [cursor=pointer]
                - button "15 мл" [ref=e214] [cursor=pointer]
                - button "20 мл" [ref=e215] [cursor=pointer]
                - button "25 мл" [ref=e216] [cursor=pointer]
                - button "30 мл" [ref=e217] [cursor=pointer]
              - button "Уточнить наличие" [ref=e218] [cursor=pointer]:
                - img [ref=e219]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e221] [cursor=pointer]:
                - generic [ref=e222]: Подробнее
                - img [ref=e223]
              - generic [ref=e225]:
                - paragraph [ref=e226]: Игривый и кокетливый аромат с нотами яблока, магнолии и белой амбры. Олицетворяет юность и беззаботную радость жизни.
                - link "Обзор в Instagram" [ref=e227] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e228]
                  - text: Обзор в Instagram
          - generic [ref=e231]:
            - img "Not a Perfume" [ref=e233]
            - generic [ref=e234]:
              - paragraph [ref=e235]: Juliette Has A Gun
              - heading "Not a Perfume" [level=3] [ref=e236]
              - generic [ref=e237]:
                - button "5 мл" [ref=e238] [cursor=pointer]
                - button "10 мл" [ref=e239] [cursor=pointer]
                - button "15 мл" [ref=e240] [cursor=pointer]
                - button "20 мл" [ref=e241] [cursor=pointer]
                - button "25 мл" [ref=e242] [cursor=pointer]
                - button "30 мл" [ref=e243] [cursor=pointer]
              - button "Уточнить наличие" [ref=e244] [cursor=pointer]:
                - img [ref=e245]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e247] [cursor=pointer]:
                - generic [ref=e248]: Подробнее
                - img [ref=e249]
              - generic [ref=e251]:
                - paragraph [ref=e252]: Минималистичный аромат на основе единственной ноты — кетала. Чистый, лаконичный и невероятно притягательный, он звучит уникально на каждом.
                - link "Обзор в Instagram" [ref=e253] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e254]
                  - text: Обзор в Instagram
          - generic [ref=e257]:
            - img "Hundred Silent Ways" [ref=e259]
            - generic [ref=e260]:
              - paragraph [ref=e261]: Nishane
              - heading "Hundred Silent Ways" [level=3] [ref=e262]
              - generic [ref=e263]:
                - button "5 мл" [ref=e264] [cursor=pointer]
                - button "10 мл" [ref=e265] [cursor=pointer]
                - button "15 мл" [ref=e266] [cursor=pointer]
                - button "20 мл" [ref=e267] [cursor=pointer]
                - button "25 мл" [ref=e268] [cursor=pointer]
                - button "30 мл" [ref=e269] [cursor=pointer]
              - button "Уточнить наличие" [ref=e270] [cursor=pointer]:
                - img [ref=e271]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e273] [cursor=pointer]:
                - generic [ref=e274]: Подробнее
                - img [ref=e275]
              - generic [ref=e277]:
                - paragraph [ref=e278]: Глубокий восточный аромат с нотами туберозы, иланга и сандала. Многогранный и обволакивающий, он раскрывается постепенно.
                - link "Обзор в Instagram" [ref=e279] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e280]
                  - text: Обзор в Instagram
      - generic [ref=e284]:
        - generic [ref=e285]:
          - heading "Новинки" [level=2] [ref=e287]
          - link "Все новинки →" [ref=e289] [cursor=pointer]:
            - /url: /catalogue?filter=new
        - generic [ref=e290]:
          - generic [ref=e291]:
            - generic [ref=e292]:
              - img "Melody Of The Sun" [ref=e293]
              - generic [ref=e294]: Новинка
            - generic [ref=e295]:
              - paragraph [ref=e296]: Mancera
              - heading "Melody Of The Sun" [level=3] [ref=e297]
              - generic [ref=e298]:
                - button "5 мл" [ref=e299] [cursor=pointer]
                - button "10 мл" [ref=e300] [cursor=pointer]
                - button "15 мл" [ref=e301] [cursor=pointer]
                - button "20 мл" [ref=e302] [cursor=pointer]
                - button "25 мл" [ref=e303] [cursor=pointer]
                - button "30 мл" [ref=e304] [cursor=pointer]
              - button "Уточнить наличие" [ref=e305] [cursor=pointer]:
                - img [ref=e306]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e308] [cursor=pointer]:
                - generic [ref=e309]: Подробнее
                - img [ref=e310]
              - generic [ref=e312]:
                - paragraph [ref=e313]: Солнечный и энергичный аромат с нотами кокоса, ванили и белого мускуса. Идеальный компаньон для тёплых летних дней.
                - link "Обзор в Instagram" [ref=e314] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e315]
                  - text: Обзор в Instagram
          - generic [ref=e318]:
            - generic [ref=e319]:
              - img "The One For Men" [ref=e320]
              - generic [ref=e321]: Новинка
            - generic [ref=e322]:
              - paragraph [ref=e323]: Dolce & Gabbana
              - heading "The One For Men" [level=3] [ref=e324]
              - generic [ref=e325]:
                - button "5 мл" [ref=e326] [cursor=pointer]
                - button "10 мл" [ref=e327] [cursor=pointer]
                - button "15 мл" [ref=e328] [cursor=pointer]
                - button "20 мл" [ref=e329] [cursor=pointer]
                - button "25 мл" [ref=e330] [cursor=pointer]
                - button "30 мл" [ref=e331] [cursor=pointer]
              - button "Уточнить наличие" [ref=e332] [cursor=pointer]:
                - img [ref=e333]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e335] [cursor=pointer]:
                - generic [ref=e336]: Подробнее
                - img [ref=e337]
              - generic [ref=e339]:
                - paragraph [ref=e340]: Классический мужской аромат с нотами кардамона, имбиря и амбры. Уверенный и харизматичный — для настоящего джентльмена.
                - link "Обзор в Instagram" [ref=e341] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e342]
                  - text: Обзор в Instagram
          - generic [ref=e345]:
            - generic [ref=e346]:
              - img "Banana Rush" [ref=e347]
              - generic [ref=e348]: Новинка
            - generic [ref=e349]:
              - paragraph [ref=e350]: Juliette Has A Gun
              - heading "Banana Rush" [level=3] [ref=e351]
              - generic [ref=e352]:
                - button "5 мл" [ref=e353] [cursor=pointer]
                - button "10 мл" [ref=e354] [cursor=pointer]
                - button "15 мл" [ref=e355] [cursor=pointer]
                - button "20 мл" [ref=e356] [cursor=pointer]
                - button "25 мл" [ref=e357] [cursor=pointer]
                - button "30 мл" [ref=e358] [cursor=pointer]
              - button "Уточнить наличие" [ref=e359] [cursor=pointer]:
                - img [ref=e360]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e362] [cursor=pointer]:
                - generic [ref=e363]: Подробнее
                - img [ref=e364]
              - generic [ref=e366]:
                - paragraph [ref=e367]: Весёлый и необычный аромат с нотами банана, жасмина и сандала. Сладкий, но не приторный — настоящий праздник для чувств.
                - link "Обзор в Instagram" [ref=e368] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e369]
                  - text: Обзор в Instagram
          - generic [ref=e372]:
            - generic [ref=e373]:
              - img "Néroli Amara" [ref=e374]
              - generic [ref=e375]: Новинка
            - generic [ref=e376]:
              - paragraph [ref=e377]: Van Cleef & Arpels
              - heading "Néroli Amara" [level=3] [ref=e378]
              - generic [ref=e379]:
                - button "5 мл" [ref=e380] [cursor=pointer]
                - button "10 мл" [ref=e381] [cursor=pointer]
                - button "15 мл" [ref=e382] [cursor=pointer]
                - button "20 мл" [ref=e383] [cursor=pointer]
                - button "25 мл" [ref=e384] [cursor=pointer]
                - button "30 мл" [ref=e385] [cursor=pointer]
              - button "Уточнить наличие" [ref=e386] [cursor=pointer]:
                - img [ref=e387]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e389] [cursor=pointer]:
                - generic [ref=e390]: Подробнее
                - img [ref=e391]
              - generic [ref=e393]:
                - paragraph [ref=e394]: Утончённый цитрусовый аромат с нотами нероли, петитгрейна и мускуса. Элегантный и свежий, он подчёркивает безупречный вкус.
                - link "Обзор в Instagram" [ref=e395] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e396]
                  - text: Обзор в Instagram
          - generic [ref=e399]:
            - generic [ref=e400]:
              - img "Another 13" [ref=e401]
              - generic [ref=e402]: Новинка
            - generic [ref=e403]:
              - paragraph [ref=e404]: Le Labo
              - heading "Another 13" [level=3] [ref=e405]
              - generic [ref=e406]:
                - button "5 мл" [ref=e407] [cursor=pointer]
                - button "10 мл" [ref=e408] [cursor=pointer]
                - button "15 мл" [ref=e409] [cursor=pointer]
                - button "20 мл" [ref=e410] [cursor=pointer]
                - button "25 мл" [ref=e411] [cursor=pointer]
                - button "30 мл" [ref=e412] [cursor=pointer]
              - button "Уточнить наличие" [ref=e413] [cursor=pointer]:
                - img [ref=e414]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e416] [cursor=pointer]:
                - generic [ref=e417]: Подробнее
                - img [ref=e418]
              - generic [ref=e420]:
                - paragraph [ref=e421]: Загадочный и притягательный аромат с нотами амбретты, жасмина и мускуса. Культовый нишевый аромат с характером.
                - link "Обзор в Instagram" [ref=e422] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e423]
                  - text: Обзор в Instagram
          - generic [ref=e426]:
            - generic [ref=e427]:
              - img "Crush" [ref=e428]
              - generic [ref=e429]: Новинка
            - generic [ref=e430]:
              - paragraph [ref=e431]: Akro
              - heading "Crush" [level=3] [ref=e432]
              - generic [ref=e433]:
                - button "5 мл" [ref=e434] [cursor=pointer]
                - button "10 мл" [ref=e435] [cursor=pointer]
                - button "15 мл" [ref=e436] [cursor=pointer]
                - button "20 мл" [ref=e437] [cursor=pointer]
                - button "25 мл" [ref=e438] [cursor=pointer]
                - button "30 мл" [ref=e439] [cursor=pointer]
              - button "Уточнить наличие" [ref=e440] [cursor=pointer]:
                - img [ref=e441]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e443] [cursor=pointer]:
                - generic [ref=e444]: Подробнее
                - img [ref=e445]
              - generic [ref=e447]:
                - paragraph [ref=e448]: Страстный аромат с нотами малины, розы и пачули. Влюбляет с первого вдоха и не отпускает — настоящая парфюмерная страсть.
                - link "Обзор в Instagram" [ref=e449] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e450]
                  - text: Обзор в Instagram
          - generic [ref=e453]:
            - generic [ref=e454]:
              - img "Limoncello Kiss" [ref=e455]
              - generic [ref=e456]: Новинка
            - generic [ref=e457]:
              - paragraph [ref=e458]: Antonio Maretti
              - heading "Limoncello Kiss" [level=3] [ref=e459]
              - generic [ref=e460]:
                - button "5 мл" [ref=e461] [cursor=pointer]
                - button "10 мл" [ref=e462] [cursor=pointer]
                - button "15 мл" [ref=e463] [cursor=pointer]
                - button "20 мл" [ref=e464] [cursor=pointer]
                - button "25 мл" [ref=e465] [cursor=pointer]
                - button "30 мл" [ref=e466] [cursor=pointer]
              - button "Уточнить наличие" [ref=e467] [cursor=pointer]:
                - img [ref=e468]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e470] [cursor=pointer]:
                - generic [ref=e471]: Подробнее
                - img [ref=e472]
              - generic [ref=e474]:
                - paragraph [ref=e475]: Яркий цитрусовый аромат с нотами лимончелло, бергамота и ванили. Как итальянское лето в одном флаконе — солнечно и радостно.
                - link "Обзор в Instagram" [ref=e476] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e477]
                  - text: Обзор в Instagram
          - generic [ref=e480]:
            - generic [ref=e481]:
              - img "Prive Thé Yulong" [ref=e482]
              - generic [ref=e483]: Новинка
            - generic [ref=e484]:
              - paragraph [ref=e485]: Giorgio Armani
              - heading "Prive Thé Yulong" [level=3] [ref=e486]
              - generic [ref=e487]:
                - button "5 мл" [ref=e488] [cursor=pointer]
                - button "10 мл" [ref=e489] [cursor=pointer]
                - button "15 мл" [ref=e490] [cursor=pointer]
                - button "20 мл" [ref=e491] [cursor=pointer]
                - button "25 мл" [ref=e492] [cursor=pointer]
                - button "30 мл" [ref=e493] [cursor=pointer]
              - button "Уточнить наличие" [ref=e494] [cursor=pointer]:
                - img [ref=e495]
                - text: Уточнить наличие
              - button "Подробнее" [ref=e497] [cursor=pointer]:
                - generic [ref=e498]: Подробнее
                - img [ref=e499]
              - generic [ref=e501]:
                - paragraph [ref=e502]: Умиротворяющий аромат с нотами зелёного чая, жасмина и мускуса. Гармония и спокойствие в каждом вдохе, вдохновлён китайским чаем Юлун.
                - link "Обзор в Instagram" [ref=e503] [cursor=pointer]:
                  - /url: https://instagram.com
                  - img [ref=e504]
                  - text: Обзор в Instagram
      - generic [ref=e508]:
        - heading "О нас" [level=2] [ref=e510]
        - generic [ref=e512]:
          - link "Оригинальная продукция Оригинальная продукция" [ref=e513] [cursor=pointer]:
            - /url: /catalogue
            - img "Оригинальная продукция" [ref=e514]
            - heading "Оригинальная продукция" [level=3] [ref=e517]
          - link "Безопасная упаковка Безопасная упаковка" [ref=e518] [cursor=pointer]:
            - /url: /catalogue
            - img "Безопасная упаковка" [ref=e519]
            - heading "Безопасная упаковка" [level=3] [ref=e522]
          - link "Доставка по Беларуси Доставка по Беларуси" [ref=e523] [cursor=pointer]:
            - /url: /catalogue
            - img "Доставка по Беларуси" [ref=e524]
            - heading "Доставка по Беларуси" [level=3] [ref=e527]
          - link "Более 950 ароматов Более 950 ароматов" [ref=e528] [cursor=pointer]:
            - /url: /catalogue
            - img "Более 950 ароматов" [ref=e529]
            - heading "Более 950 ароматов" [level=3] [ref=e532]
        - generic [ref=e533]:
          - generic [ref=e534]:
            - heading "1000 Ароматов" [level=3] [ref=e535]
            - paragraph [ref=e536]: Мы — магазин парфюмерии на распив, который предлагает вам возможность познакомиться с элитными ароматами без необходимости покупать полный флакон. Каждый отливант разливается из оригинального флакона в стерильные условия с соблюдением всех стандартов качества.
            - paragraph [ref=e537]: "В нашем каталоге более 950 ароматов от ведущих мировых брендов: нишевая, люксовая и селективная парфюмерия. Мы гарантируем подлинность каждого флакона и бережную доставку по всей Беларуси."
            - generic [ref=e538]:
              - generic [ref=e539]:
                - generic [ref=e540]: 📍
                - generic [ref=e541]: Минск, Беларусь
              - generic [ref=e542]:
                - generic [ref=e543]: 📞
                - generic [ref=e544]: +375 (29) 123-45-67
              - generic [ref=e545]:
                - generic [ref=e546]: ✉️
                - generic [ref=e547]: info@1000aromatov.by
              - generic [ref=e548]:
                - generic [ref=e549]: 🕐
                - generic [ref=e550]: "Пн–Пт: 10:00–20:00, Сб: 11:00–18:00"
          - iframe [ref=e552]:
            - generic [ref=f1e2]:
              - img
              - region "Map" [ref=f1e3]
              - generic:
                - generic [ref=f1e4]:
                  - button "Zoom In" [ref=f1e5] [cursor=pointer]
                  - button "Zoom Out" [ref=f1e7] [cursor=pointer]
                - group [ref=f1e9]:
                  - generic [ref=f1e10]:
                    - text: ©
                    - link "OpenStreetMap contributors" [ref=f1e11] [cursor=pointer]:
                      - /url: /copyright
                    - text: ♥️
                    - link "Make a Donation" [ref=f1e12] [cursor=pointer]:
                      - /url: https://supporting.openstreetmap.org
                    - text: .
                    - link "Website and API terms" [ref=f1e13] [cursor=pointer]:
                      - /url: https://wiki.osmfoundation.org/wiki/Terms_of_Use
    - contentinfo [ref=e553]:
      - generic [ref=e554]:
        - generic [ref=e555]:
          - generic [ref=e556]:
            - link "1000 АРОМАТОВ 1000 АРОМАТОВ ПАРФЮМ НА РАСПИВ" [ref=e557] [cursor=pointer]:
              - /url: /
              - img "1000 АРОМАТОВ" [ref=e558]
              - generic [ref=e559]:
                - generic [ref=e560]: 1000 АРОМАТОВ
                - generic [ref=e561]: ПАРФЮМ НА РАСПИВ
            - paragraph [ref=e562]: Интернет-магазин отливантов элитной парфюмерии. Оригинальные ароматы от 2 мл с доставкой по всей Беларуси.
          - generic [ref=e563]:
            - heading "Навигация" [level=4] [ref=e564]
            - list [ref=e565]:
              - listitem [ref=e566]:
                - link "Каталог" [ref=e567] [cursor=pointer]:
                  - /url: /catalogue
              - listitem [ref=e568]:
                - link "Хиты продаж" [ref=e569] [cursor=pointer]:
                  - /url: /catalogue?filter=featured
              - listitem [ref=e570]:
                - link "Новинки" [ref=e571] [cursor=pointer]:
                  - /url: /catalogue?filter=new
              - listitem [ref=e572]:
                - link "О нас" [ref=e573] [cursor=pointer]:
                  - /url: /#about
          - generic [ref=e574]:
            - heading "Бренды" [level=4] [ref=e575]
            - list [ref=e576]:
              - listitem [ref=e577]:
                - link "Akro" [ref=e578] [cursor=pointer]:
                  - /url: /catalogue?brand=akro
              - listitem [ref=e579]:
                - link "Antonio Maretti" [ref=e580] [cursor=pointer]:
                  - /url: /catalogue?brand=antonio-maretti
              - listitem [ref=e581]:
                - link "Attar Collection" [ref=e582] [cursor=pointer]:
                  - /url: /catalogue?brand=attar-collection
              - listitem [ref=e583]:
                - link "By KILIAN" [ref=e584] [cursor=pointer]:
                  - /url: /catalogue?brand=by-kilian
              - listitem [ref=e585]:
                - link "Byredo" [ref=e586] [cursor=pointer]:
                  - /url: /catalogue?brand=byredo
              - listitem [ref=e587]:
                - link "Chloé" [ref=e588] [cursor=pointer]:
                  - /url: /catalogue?brand=chlo
              - listitem [ref=e589]:
                - link "Dolce & Gabbana" [ref=e590] [cursor=pointer]:
                  - /url: /catalogue?brand=dolce-and-gabbana
              - listitem [ref=e591]:
                - link "Essential Parfums" [ref=e592] [cursor=pointer]:
                  - /url: /catalogue?brand=essential-parfums
          - generic [ref=e593]:
            - heading "Контакты" [level=4] [ref=e594]
            - list [ref=e595]:
              - listitem [ref=e596]:
                - text: "Telegram:"
                - link "@1000aromatov" [ref=e597] [cursor=pointer]:
                  - /url: https://t.me/1000aromatov
              - listitem [ref=e598]:
                - text: "Viber:"
                - link "+375 (29) 123-45-67" [ref=e599] [cursor=pointer]:
                  - /url: viber://chat?number=+375291234567
              - listitem [ref=e600]:
                - text: "Instagram:"
                - link "@1000aromatov" [ref=e601] [cursor=pointer]:
                  - /url: https://instagram.com/1000aromatov
              - listitem [ref=e602]:
                - text: "Email:"
                - link "info@1000aromatov.by" [ref=e603] [cursor=pointer]:
                  - /url: mailto:info@1000aromatov.by
            - generic [ref=e604]:
              - link [ref=e605] [cursor=pointer]:
                - /url: https://t.me/1000aromatov
                - img [ref=e606]
              - link [ref=e608] [cursor=pointer]:
                - /url: viber://chat?number=+375291234567
                - img [ref=e609]
              - link [ref=e611] [cursor=pointer]:
                - /url: https://instagram.com/1000aromatov
                - img [ref=e612]
        - generic [ref=e614]:
          - paragraph [ref=e615]: © 2026 1000 АРОМАТОВ. Все права защищены.
          - generic [ref=e616]:
            - link "Политика конфиденциальности" [ref=e617] [cursor=pointer]:
              - /url: "#"
            - link "Оферта" [ref=e618] [cursor=pointer]:
              - /url: "#"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * E2E Tests for AromaAromas Frontend Application
  5   |  *
  6   |  * These tests verify the core functionality of the application
  7   |  * including navigation, user interactions, and API integration.
  8   |  */
  9   | 
  10  | test.describe('AromaAromas Application', () => {
  11  | 
  12  |   test.describe('Homepage', () => {
  13  | 
  14  |     test('should load the homepage successfully', async ({ page }) => {
  15  |       await page.goto('/');
  16  | 
  17  |       // Check page loaded - body should be visible
  18  |       await expect(page.locator('body')).toBeVisible();
  19  | 
  20  |       // Check for main navigation
> 21  |       await expect(page.locator('header, nav')).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  22  |     });
  23  | 
  24  |     test('should display hero section', async ({ page }) => {
  25  |       await page.goto('/');
  26  | 
  27  |       // Check for hero banner content
  28  |       const heroBanner = page.locator('[class*="hero"], [class*="banner"], main > div, section').first();
  29  |       await expect(heroBanner).toBeVisible();
  30  |     });
  31  | 
  32  |     test('should have working navigation links', async ({ page }) => {
  33  |       await page.goto('/');
  34  | 
  35  |       // Find and check navigation links exist
  36  |       const navLinks = page.locator('header a, nav a');
  37  |       await expect(navLinks).not.toHaveCount(0);
  38  |     });
  39  |   });
  40  | 
  41  |   test.describe('Catalogue', () => {
  42  | 
  43  |     test('should navigate to catalogue page', async ({ page }) => {
  44  |       await page.goto('/');
  45  | 
  46  |       // Click on catalogue link in navigation (text could be "Каталог" or similar)
  47  |       const catalogueLink = page.locator('a[href="/catalogue"]');
  48  |       if (await catalogueLink.count() > 0 && await catalogueLink.isVisible()) {
  49  |         await catalogueLink.click();
  50  |         await expect(page).toHaveURL(/.*catalogue.*/);
  51  |       } else {
  52  |         // Direct navigation fallback
  53  |         await page.goto('/catalogue');
  54  |         await expect(page).toHaveURL(/.*catalogue.*/);
  55  |       }
  56  |     });
  57  | 
  58  |     test('should display product cards', async ({ page }) => {
  59  |       await page.goto('/catalogue');
  60  | 
  61  |       // Wait for page to load
  62  |       await page.waitForLoadState('networkidle');
  63  | 
  64  |       // Check for product cards or grid
  65  |       const productCards = page.locator('[class*="card"], [class*="product"], article');
  66  |       // Product cards may be loaded async, so just check the page structure exists
  67  |       await expect(page.locator('main')).toBeVisible();
  68  |     });
  69  | 
  70  |     test('should have search functionality', async ({ page }) => {
  71  |       await page.goto('/catalogue');
  72  | 
  73  |       // Wait for page to load
  74  |       await page.waitForLoadState('networkidle');
  75  | 
  76  |       // Look for search input (Russian placeholder: "Поиск по названию или бренду...")
  77  |       const searchInput = page.locator('input[type="text"], input[placeholder*="Поиск"], input');
  78  |       const count = await searchInput.count();
  79  |       expect(count).toBeGreaterThan(0);
  80  |     });
  81  | 
  82  |     test('should filter products on search', async ({ page }) => {
  83  |       await page.goto('/catalogue');
  84  |       await page.waitForLoadState('networkidle');
  85  | 
  86  |       // Find search input and type
  87  |       const searchInput = page.locator('input[type="text"]').first();
  88  |       if (await searchInput.isVisible()) {
  89  |         await searchInput.fill('test');
  90  |         // Wait for filter to apply
  91  |         await page.waitForTimeout(500);
  92  |         // Results area should still be visible
  93  |         await expect(page.locator('main')).toBeVisible();
  94  |       }
  95  |     });
  96  |   });
  97  | 
  98  |   test.describe('Authentication', () => {
  99  | 
  100 |     test('should have login option in navigation', async ({ page }) => {
  101 |       await page.goto('/');
  102 | 
  103 |       // Look for login link or button (could be admin or OIDC login)
  104 |       const authLink = page.locator('a[href*="login"], a[href*="admin"], button:has-text("Login"), button:has-text("Вход")');
  105 |       // At minimum, the page should load without auth errors
  106 |       await expect(page.locator('body')).toBeVisible();
  107 |     });
  108 | 
  109 |     test('should display admin page', async ({ page }) => {
  110 |       await page.goto('/admin');
  111 | 
  112 |       // Admin page should load (may show login or dashboard)
  113 |       await expect(page.locator('body')).toBeVisible();
  114 |     });
  115 |   });
  116 | 
  117 |   test.describe('Product Detail', () => {
  118 | 
  119 |     test('should navigate to product detail from catalogue', async ({ page }) => {
  120 |       await page.goto('/catalogue');
  121 |       await page.waitForLoadState('networkidle');
```