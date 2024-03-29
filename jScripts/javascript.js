document.addEventListener("DOMContentLoaded", function (event) {
  //פונקציות שפועלות בטעינת העמוד//
  jsonLoop();

  //ממיר סטרינג לתאריך//
  function convertDateString(dateString) {
    const parts = dateString.split(".");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return new Date(formattedDate);
  }

  const searchInput = document.querySelector(".search__input");
  searchInput.addEventListener("input", function () {
    //searchInputמאזין לאינפוט של ה
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBlogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.subheading.toLowerCase().includes(searchTerm)
    );

    renderBlogs(filteredBlogs); //נשלח ליצירה בפוקנצה שמרנדרת את הבלוגים המסוננים
  });
  document.getElementById("filterBtn").addEventListener("click", function () {
    //מציג בלחיצה את התפריט של הפילטר
    var dropdownContent = document.querySelector(".sort-dropdown-content");
    if (dropdownContent.style.display === "block") {
      //בדיקה אם התפריט פתוח
      dropdownContent.style.display = "none"; //סגירת התפריט
    } else {
      dropdownContent.style.display = "block"; //פתיחת התפריט במידה והוא לא פתוח
    }
  });

  document.getElementById("sortNewest").addEventListener("click", function (e) {
    // פונקציה שממיינת את תאריכי הפרסום באמצעות מתודת sort//
    e.preventDefault();
    blogs.sort(
      //מתודה למיון תאריכים
      (a, b) =>
        convertDateString(b.publishingDate) - //מיון לפי תאריך גדול יותר
        convertDateString(a.publishingDate)
    );
    renderBlogs(blogs); // נשלח לרנדור מחדש לאחר הסידור
  });

  document.getElementById("sortOldest").addEventListener("click", function (e) {
    // פונקציה שממיינת את תאריכי הפרסום באמצעות מתודת sort//
    e.preventDefault();
    blogs.sort(
      (a, b) =>
        convertDateString(a.publishingDate) - // מיון לפי תאריך קטן יותר
        convertDateString(b.publishingDate)
    );
    renderBlogs(blogs); // נשלח לרנדור מחדש לאחר הסידור
  });
});

function renderBlogs(filteredBlogs) {
  //פונקציה שמרנדרת את הבלוגים
  const listContainer = document.getElementById("blogListContainer");

  listContainer.className = "row"; //לצורך גריד של שורות
  if (!listContainer) {
    console.error('The container with ID "blogListContainer" was not found.'); //הערת לקונסול במידה ולא נמצא קונטיינר
    return;
  }

  // מנקה את התוכן הקודם
  listContainer.innerHTML = "";

  //עושה לופ על כל הבלוגים ויוצר לכל אחד מהם html
  filteredBlogs.forEach((blog) => {
    const article = document.createElement("div");
    article.className = "col-md-4 col-sm-6 col-12 mb-4"; //מתן קלאס רלוונטי של בוטסטראפ
    article.innerHTML = `
    <div class="card h-100 card-margin">
      <img src="images/${blog.thumbnail}" class="card-img-top" alt="${blog.title}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${blog.title}</h5>
        <p class="card-text">${blog.subheading}</p>
        <p class="card-text mt-auto"><small class="text-muted">${blog.publishingDate}</small></p>
        <button class="toArticleBtn mt-auto align-self-start" role="button" data-blog-id="${blog.id}">לכתבה המלאה</button>
      </div>
    </div>
    `;
    listContainer.appendChild(article);
  });

  document.querySelectorAll(".toArticleBtn").forEach((button) => {
    //פונקציה שפותחת את הפופאפ בלחיצה על הכתפור
    button.addEventListener("click", function () {
      const blogId = this.getAttribute("data-blog-id"); //שומר את האטריביוט של הבלוג
      const blog = blogs.find((blog) => blog.id.toString() === blogId);
      if (blog) {
        //במידה והבלוג קיים
        const modalTitle = document.querySelector("#articleModalLabel");
        const modalBody = document.querySelector("#articleModal .modal-body");

        //מנקה את התוכן הקודם שהיה במודל
        modalBody.innerHTML = "";

        // מזין את הכותרת המתאימה של הבלוג הרלוונטי
        modalTitle.textContent = blog.title;
        const articleText = document.createElement("p");
        articleText.innerHTML = blog.fullArticale.replace(/\n/g, "<br>"); //
        modalBody.appendChild(articleText);

        var modal = new bootstrap.Modal(
          document.getElementById("articleModal")
        );
        modal.show(); // מציג את הפופ-אפ
      } else {
        console.error("Blog not found! Blog ID:", blogId); // הודעת שגיאה במידה ולא נמצא הבלוג שצריך להפתח עברו פופאפ
      }
    });
  });
  // אם אין תוצאות שתואמות את החיפוש בתיבת החיפוש- מציג למשתמש הודעה כי אין כתובות תואמות
  if (filteredBlogs.length === 0) {
    //רואה שאין בלוגים מתאימים
    const noResultsMsg = document.createElement("p"); // יוצר מקום לכתיבת ההודעה
    noResultsMsg.textContent = "אין כתבות שתואמות את החיפוש."; //מזין בה את ההודעה
    listContainer.appendChild(noResultsMsg);
  }
}
// ג׳ייסון של הבלוגים
const blogs = [
  {
    id: 1,
    title: "חוגגים את החגים",
    thumbnail: "roshHashana.jpeg",
    subheading: "כיצד אפשר לחגוג את החג בסגר תוך שליטה בכסף ובתקציב",
    publishingDate: "12.09.2020",
    fullArticale: `
    מסתמן שהשנה נחגוג את חגי תשרי בסגר, כמו שנאלצנו לחגוג את פסח.
    שוב נהיה כולנו יחד עם הילדים בבית, המון ימים ברצף.
    
    ככל שהסגר יאפשר, תרצו לצאת החוצה, לנשום אויר, לבלות, לשנות שגרה.
    אני מכירה המון משפחות שתקציב הבילויים שלהם ואוכל בחוץ יצא משליטה. 

    אנחנו נמצאים בתקופה לא פשוטה שבה מאות אלפי משקי בית איבדו חלק מההכנסה שלהם, אם לא את כולה.
    לכן ההמלצה שלי היא לקבוע תקציב.
    הגינה שלי פורחת לכבוד החג וזה מאוד משמח אותי.
    איך קובעים את התקציב? האמת שזה ממש פשוט!

    קודם כל בודקים כמה הוצאתם על בילויים ועל אוכל בחוץ ב-3 החודשים האחרונים.
    תעברו בצורה יסודית על פירוט כרטיסי האשראי שלכם ותעשו חישוב. זו קצת עבודה שחורה אבל היא כדאית.
    עושים את זה פעם אחת וזהו. יש לנו בסיס מספרי להבין על מה אנחנו מוציאים כסף.

    עכשיו שבו עם המספרים שקיבלתם (ממוצע של 3 החודשים האחרונים). דברו ביניכם על המספרים והסכומים שיצאו. יש סכומים שנראים לכם גבוהים? יש מקומות שאם חושבים שהגזמתם קצת?
    הסכום גבוה? תחשבו יחד כמה הייתם מוכנים בהחלטה להוציא? נסו להגיע לסכום שמוסכם עליכם כמתאים. הגעתם לסכום כזה? מעולה, זה התקציב שלכם.

    כעת שבו ותכננו מראש מה הפעילויות שאתם רוצים לעשות, בדקו כמה זה צפוי לעלות לכם, קבלו החלטה שלא חורגים מהתקציב.

    גם אם המשמעות היא שצריך לוותר על חלק מהפעילויות שרציתם לעשות, או לחפש פעילות זולה יותר/חינמית אופציונלית.

    מה תרוויחו כאן? גם תחושת שליטה מעולה וגם עמידה הכרחית בתקציב. תכנון הוא מפתח לעמידה טובה בתקציב.
    
    שתהיה לכם שנה נפלאה. תזכרו שהכל צריך להיות בפרופורציות – זו רק ארוחה, חגיגית אמנם, המטרה היא לחגוג את תחילת השנה החדשה עם האנשים שאתם אוהבים.
    תהנו מהאווירה והמשפחה ומהשקט שהסגר כופה עלינו, תנסו להסתכל על חצי הכוס המלאה, זה נעים יותר.
  `,
  },
  {
    id: 2,
    title: "מה חשוב לזכור כשמחליפים רכב",
    thumbnail: "car.jpeg",
    subheading: "לפני 12 שנים, כשאלונה ביתי הצעירה נולדה רכשתי רכב חדש",
    publishingDate: "20.02.2018",
    fullArticale: `לפני 12 שנים, כשאלונה ביתי הצעירה נולדה רכשתי רכב חדש. ברכב הישן שמאוד אהבתי, לא היה מקום מאחור לכיסא תינוק ו-2 בוסטרים של הבנות שלי.
    12 שנים חלפו, שתיים מהבנות שלי כבר נוהגות בעצמן והרכב התיישן.
    בחודשים האחרונים היו כל מיני תקלות קטנות שסימנו לי שהגיע הזמן להחליף את הרכב. החלטה קשה. מה השיקולים שלקחתי בחשבון לפני שהחלטתי מה לעשות?

    1. מכירת רכב יד שניה – חברה יקרה שלי מנסה כבר כמה חודשים למכור רכב בן 3 שמחיר המחירון שלו הוא כ-60,000 ש"ח , ואפילו כשניסתה למכור את הרכב בחצי ממחיר המחירון היא לא הצליחה. שוק המכוניות יד 2 בארץ בשפל והמחשבה שאצטרך להשקיע סכום כסף גדול ברכישת רכב שאח"כ אתקשה מאוד למכור אותו במחיר סביר הרתיעה אותי מאוד.
    2. מחיר הביטוח לרכב ישן בן 12 – לפני חודשיים כשהייתי צריכה לחדש את הביטוח על הרכב גיליתי שמחיר הביטוח עלה כי הרכב כבר ישן ונאלצתי לשלם 400 ש"ח יותר מבשנה שעברה על הביטוח.
    3. כמה אני מוציאה על הרכב בשוטף? – עשיתי חישוב שכיום ההוצאות שלי על הרכב (ללא דלק) מסתכמות בכ-1000 ש"ח לחודש (על ביטוחים, טסט וטיפולים שונים)
    4. כמה אצטרף להוסיף? – התלבטתי המון. מצד אחד רציתי רכב שיהיו לו כל אמצעי הבטיחות המודרניים עבור הנהגות הצעירות שלי, כלומר רכב חדש. מצד שני רכישת רכב חדש זו הוצאה גדולה ממש, והרכב עצמו מאבד מערכו בכל יום. על מנת לרכוש רכב חדש שיעמוד בסטנדרטים של בטיחות, שהיא הכי חשובה לי, איאלץ לקחת הלוואה לרכישת רכב ולשלם החזר חודשי של מעל 1000 ש"ח בחודש.אז מה החלטתי לעשות?

    בסופו של דבר, לאחר שלקחתי הצעות מחיר מכמה חברות, בחרתי לקחת רכב בליסינג תפעולי כלומר רכב שהתשלום החודשי עליו כולל גם את הביטוחים הטיפולים והטסט. בעוד 3 שנים אחזיר את הרכב לחברה ואוכל לבחור רכב חדש. בצורה זו אני לא מתעסקת עם מכירת רכב יד שנייה, ובכל 3 שנים אני יכולה לקבל רכב חדש ובטיחותי.
    התשלום החודשי על הרכב נמוך ממה שהייתי משלמת אם הייתי לוקחת הלוואה לצורך רכישת רכב ומשלמת גם ביטוח, טיפולים ברכב, טסט בעוד שנתיים וכו'.
    בבדיקה שלי התברר שהרכב הישן יכול לשמש לתשלום המקדמה על הרכב, כך שלא אצטרך להתעסק במכירת הרכב הישן.
    בדיקה מול רואת החשבון שלי העלתה שהתשלום החודשי הוא הוצאה מוכרת (בחלקה) וכבעלת עסק זו בשורה מעולה.
    אז זהו החלטתי, ומיד ביצעתי. כשהרכב החדש הגיע, נסעתי לסוכנות, השארתי שם את הרכב הישן, וחזרתי הביתה כשאני נוהגת ברכב חדש וריחני, המאובזר באביזרי בטיחות מפנקים. כבר שבועיים שאני נוהגת ברכב החדש שלי ואני מאוד מרוצה.
    
    הערה חשובה: כל אחד חייב לבדוק מה האמצעים העומדים לרשותו כשהוא מתכוון להחליף רכב ועל סמך זה לקבל החלטה. לא בהכרח מה שמתאים לי יתאים גם לכם.
    
    יחד עם כל ההחלטות האלה שהייתי צריכה לקבל, זה הייתי צריכה לטפל בהמון דברים קטנים שנובעים מהחלפת הרכב: שינוי מספר הרכב בפנגו, בכביש 6, קבלת מדבקת חניה חדשה מהעירייה ועוד ועוד. אז כמובן שהכנתי גם לכם רשימת דברים שחייבים לזכור לעשות כשמחליפים רכב.
    תוכלו לקבל אותה לאחר שתירשמו כאן למטה.`,
  },
  {
    id: 3,
    title: "מעבר לבנק אחר",
    thumbnail: "bank.jpeg",
    subheading:
      "בכל הרצאה או סדנא שאני מעבירה, וגם כל זוג שמגיע אלי לייעוץ, תמיד מתעניינים האם אפשר לעבור בנק בקלות.",
    publishingDate: "07.12.2017",
    fullArticale: `בכל הרצאה או סדנא שאני מעבירה, וגם כל זוג שמגיע אלי לייעוץ, תמיד מתעניינים האם אפשר לעבור בנק בקלות.

    היום בעידן הדיגיטאלי זה פחות מסובך אבל מזכירה תמיד לאלה ששואלים שצריך לעשות שופינג בין הבנקים ולבדוק, בהתאם לצרכים הספציפיים שלכם, מה התנאים שהבנק מציע לכם.
    חשוב להבין שמעבר לבנק אחר צריך היעשות לא מתוך גחמה, אלא מתוך רצון להשיג תנאים טובים יותר או כי הבנק שבו יש לכם חשבון כיום אינו נגיש/זמין לצרכים שלכם.
    
    אז מה חשוב שתשאלו בבנק לפני שאתם מחליטים לעבור?
    איך השרותים הדיגיטליים שלהם. כי היום בעידן הדיגיטלי לא צריך באמת ללכת לסניף ויש המון פעולות שאפשר לעשות גם באתר האינטרנט ובאפליקציה של הבנק או במכשירי הכספומט הפזורים בכל מקום. למשל: לי יש חשבון ותיק מאוד בבנק שהשרותים הדיגיטליים, איך לומר, לא משהו. וכשאני קוצה להפקיד המחאה בחשבון יש 2 אפשרויות – לעמוד בתור בסניף או לשים את המעטפה בתיבת "אל תור" עם חשש מסוים שההמחאה תיעלם משם. לפני תקופה הסניף שלי אמנם התקין כספומט שניתן להפקיד בו צ'קים אבל בדרך כלל הוא מקולקל ובכלל אי אפשר להפקיד בו צ'קים דחויים. מעצבן. איזה עמלות משלמים ואיזה עמלות הבנק מוותר עליהן עבורכם? יש אנשים רבים שהבנק לא גובה מהם עמלות של ניהול חשבון ועמלות שורה לפי מסלולי העמלות של בנק ישראל. אז מה כן? (ממליצה שתבדקו גם בקשר לעמלות שמשלים על ניהול תיק השקעות, הזמנת פנקסי צ'קים וכו) תצטרכו לשאול בבנק.
    מסגרת האשראי בחשבון – מהי המסגרת שהבנק יאפשר לכם? באיזו ריבית?

    איזה כרטיסי אשראי הבנק ינפיק עבורכם? האם משלמים עמלת שימוש בכרטיס? יש בנקים שלא גובים עמלה, אם ביקשו מכם עמלה אולי עדיף לוותר על הכרטיס של הבנק.
    עניין חשוב ביותר לטעמי הוא זמינות הבנקאי אלי. חשוב להבין מה שעות פתיחת הסניף בראש ובראשונה. אח"כ חשוב להבין האם יש לי מספר ישיר או כתובת מייל שאני יכולה לפנות אל הבנקאי? האם הקשר עם הבנקאי הוא דרך מוקד טלפוני? תוך כמה זמן הבנק מתחייב לחזור אלי?

     אני חובבת שירותים דיגיטליים כי הם מקלים עלינו את ההתנהלות היומיומית. ביצוע העברה בנקאית או הפקדת צ'ק באמצעות האפליקציה חוסכת לי זמן ונגישה לי בכל שעה משעות היממה. חשוב לבדוק מה אפשר לבצע בערוצים הדיגיטליים וגם מה לא.
    הדבר האחרון והכי חשוב הוא להבין לכמה זמן תקבלו את ההטבות שהבטיחו לכם – לתמיד? לשנה? ל-3 שנים?. אני ממליצה לקבל את עיקרי הדברים שהובטחו בכתב.אם אתם עושים שופינג לבנק חדש, הכנתי עבורכם קובץ להדפסה ובו עיקר השאלות שחשוב לשאול בבנק.`,
  },
  {
    id: 4,
    title: "איך חוסכים בהוצאות רכב",
    thumbnail: "saving.jpeg",
    subheading:
      "לפני כמה חודשים הגיעו אלי זוג נחמד לייעוץ. הם גרו ביישוב קהילתי מרוחק, הרוויחו יפה אבל לא הצליחו לאזן בין ההכנסות להוצאות.",
    publishingDate: "14.04.2015",
    fullArticale: `לפני כמה חודשים הגיעו אלי זוג נחמד לייעוץ. הם גרו ביישוב קהילתי מרוחק, הרוויחו יפה אבל לא הצליחו לאזן בין ההכנסות להוצאות.

    כשהגענו במהלך הייעוץ לשלב שבו צריך להתחיל לבדוק באיזה סעיפים הוצאה ניתן לצמצם ראיתי שסעיף הוצאות הרכב שלהם היה ממש גבוה. הסברתי הלם שאפשר לעשות מספר מהלכים לצמצום ההוצאה – הם היו ממש סקפטיים. הצעתי שנעשה כמה מהלכים ונבדוק. הסכימו. מה הצעתי להם לעשות?

    1. מאחר וכל טיפול בסידורים השונים (בנק, קניות בסופר, רופא ילדים וכד') הצריך נסיעה לעיר הקרובה מרחק 40 דק' נסיעה – המלצתי שירכזו את כל הסידורים ליום אחד, ייסעו רק פעם אחת, ביום קבוע בשבוע, לעיר הקרובה ויחסכו המון כסף בדלק (כמובן שאם צריך דחוף רופא ילדים – לא עושים חשבון כמה דלק זה יעלה).
    2. הצעתי לבדוק ולבצע השוואה של ביטוחי הרכב. באתר של משרד האוצר יש מחשבון ביטוח חובה – חובה לבדוק שם לפני שרצים לעשות ביטוח. גם באתר wobi ניתן לבצע השוואה של מחירי ביטוח לרכב ולהוזיל את העלויות.
    3.להקפיד על טיפול שוטף ברכב. זה חשוב כמובן בראש ובראשונה לבטיחותכם ובטיחות הנוסעים שלכם אבל רכב מטופל גם יכול לחסוך בהוצאות הדלק. דוגמא? לקוחה שלי סיפרה לי שלקחה את הרכב שלה לטסט והבוחן אמר לה שהיא לא יוצאת מהמכון לפני שהיא מחליפה צמיגים כי הם במצב גרוע. ומה קרה אח"כ? פתאום היא גילתה שעם הצמיגים החדשים צריכת הדלק שלה ירדה ב-30%. כדאי לבדוק גם? ברור שכן!
    4. להקפיד לתדלק במשאבות לתדלוק עצמי. חיסכון של כ-300 ש"ח בשנה.
    
    אז מה קרה בפועל?
    הזוג הנמרץ ארגן מחדש את הלו"ז שלו כך שפעם בשבוע אחה"צ הם נוסעים לעיר הגדולה ומטפלים בכל מה שצריך. הוצאות הדלק ירדו וגם ההוצאות על המזון כי הם החלו לעשות קניות באופן קבוע בסופר הגדול שבעיר ולא בצרכניה הקטנה והיקרה בישוב בו הם גרים.
    דבר נוסף – בבדיקת הביטוחים שהם משלמים על הרכב התברר שהם יכולים להוזיל את עלות הביטוח בכמה מאות שקלים. שווה? בטח שכן!.
    
    עוד המלצה אחת שבכלל לא קשורה לחיסכון – תחליטו על יום בשבוע שאתם לא מזיזים את הרכב מהחניה. אני עושה לפחות יום אחד כזה בשבוע. גם עושה כושר, גם מסייעת בדרכי שלי הקטנה להקטנת זיהום האוויר וגם חוסכת המון דלק.
    
    עוד 2 דברים:
    
    אחד – קרדיט לאחותי המאוד מאוד מוכשרת, רותי,  על הציור המקסים של האוטו.
    והשני – בעצם לא חייבים רכב, אפשר להגיע לעבודה גם במזחלת 🙂`,
  },
  {
    id: 5,
    title: "עונת החתונות הגיעה- כל מה שחשוב לדבר עליו לפני כל ההכנות",
    thumbnail: "wedding.jpeg",
    subheading:
      "השבוע אנחנו חוגגים את לל, בין השאר, את פתיחת עונת החתונות. לפני כמה שנים פגשתי זוג נחמד שהגיע לאחת הסדנאות שלי.",
    publishingDate: "21.05.2016",
    fullArticale: `השבוע אנחנו חוגגים את ל"ג בעומר שמסמל, בין השאר, את פתיחת עונת החתונות.

    לפני כמה שנים פגשתי זוג נחמד שהגיע לאחת הסדנאות שלי. הם היו נשואים 6 שנים, הורים לילד בן 4, היו מחשבות על הגדלת המשפחה אבל הם עדיין שילמו חובות של הלוואות שלקחו לפני החתונה כדי לקיים את חתונת החלומות שלהם.
    זוגות רבים מתכוננים ליום הזה ומוצאים בו מקום למימוש כל מיני חלומות שלהם, חלקם ריאליים וחלקם קצת פחות. בתואנה ש"מתחתנים רק פעם אחת", הם לא עוצרים רגע לחשוב על משמעות ההוצאה הענקית שעומדת לפתחם.
    לרגע כל המעורבים שוכחים שמדובר בערב אחד בחיים שאחריו – יש חיים שלמים לחיות יחד.
    אם מתכננים חתונה יקרה ללא יכולת אמיתית לממן אותה, נשארים אחר כך, בהנחה שהמתנות שקיבל הזוג המאושר, לא כיסו את עלות האירוע, עם הלוואות שצריך להחזיר, הרבה אחרי שהדי הערב הנפלא שככו.
    חתונה ממוצעת בישראל עולה כ-120,000 ש"ח, סכום עצום שיקח זמן רב אחר כך לחסוך אותו בחזרה. מה אני ממליצה לעשות כדי להשאיר את הוצאות החתונה בשליטה?

    1. קבעו תקציב והחליטו שלא חורגים ממנו. עשו בקרה שבועית על ההוצאות וודאו שאתם בשליטה.
    2. הכינו טבלה מסודרת ובה מפורטים כל הפרטים הקטנים שמרכיבים את הארוע – החל בפרחים וכלה בשבת חתן וחינה, אם נהוג אצלכם לחגוג אותה.
    3. הכינו רשימת מוזמנים מפורטת ובקשו אישור הגעה מכולם, כדי שלא תשלמו על מקומות שהזמנתם ולא התמלאו.
    4.אל תבנו על המתנות שתקבלו. פגשתי כבר כמה וכמה זוגות שהתאכזבו מאוד מהמתנות שקיבלו ובוודאי שלא כיסו את כל הוצאות האירוע. מה חשוב לדעת בצעדים הראשונים שלכם כזוג נשוי?
    1. שכדאי לפתוח חשבון בנק משותף ולקבוע תקציב משותף לכם כמשפחה. חשבון בנק משותף משמש כלי נוח לבקרה על ההוצאות.
    2. זה הזמן לעדכן כתבי מוטבים בפנסיה ובביטוח החיים אם יש לכם כזה.
    3. הכסף שנשאר לכם – אל תתפתו להשקיע אותו בהשקעות מסוכנות. הכינו רשימת חלומות – למה הכסף הזה אמור לשמש אתכם והתייעצו עם אנשי מקצוע לגבי השימוש בו.
    
    לסיכום חשוב לי לומר שתהנו מהחתונה שלכם ושכדאי שתדברו בפתיחות ובשקיפות על ההוצאות שלכם.
    זה הרגל חשוב וטוב לחיים המשותפים שלכם.
    
    ולכל אלה שלא מתחתנים אבל מוזמנים לחתונה או כל ארוע אחר ולא יודעים כמה כסף להביא במתנה – אתם מוזמנים היכנס למחשבון כאן ולהחליט.
    
    מזל טוב!`,
  },
  {
    id: 6,
    title: "ילדים וכסף - דמי כיס",
    thumbnail: "kid_saving.jpeg",
    subheading:
      "בשבוע שעבר כתבתי על איך אפשר לעבור את החופש הגדול בלי לפשוט את הרגל. קיבלתי המון תגובות ושאלות על דמי כיס, איך עושים את זה?",
    publishingDate: "22.06.2011",
    fullArticale: `בשבוע שעבר כתבתי על איך אפשר לעבור את החופש הגדול בלי לפשוט את הרגל. קיבלתי המון תגובות ושאלות על דמי כיס, איך עושים את זה?

    החזון ההורי הוא לתת לילדינו כלים לעצמאות ובגרות שיעצבו את חייהם כאדם בוגר. הכסף הוא חלק חשוב מכך שכן עצמאות כלכלית מובילה למימוש חלומות והגשמת מאוויים. כולנו רוצים שילדינו, כבוגרים, יוכלו לממש את חלומותיהם. אם ילמדו לנהל נכון את הכסף – יש סיכוי טוב שיוכלו לממש חלומות.
    בואו לא נשכח שהילדים שלנו חיים היום בחברה השגית, תחרותית וחומרנית שמודדת אותם, פעמים רבות, על פי מותגים.
    אנחנו חיים בעולם של שפע והשפע הזה מבלבל, גם אותנו המבוגרים, ובמיוחד את הילדים שלנו ולעיתים גורם להם לבחור בחירות מוטעות. ככל שהאריזה יותר נוצצת, צבעונית ומושכת, כך הסיכוי שנבחר בה למרות שייתכן ומדובר במוצר נחות מבחינה איכותית.

אני מאמינה שצריך לדבר עם הילדים על כסף – ללמד אותם את ערכו, להראות להם השוואות בין דבר לדבר, להסביר להם בפשטות שאם נקנה את  X לא יישאר לנו מספיק ל-Y וגם כמובן להציב להם גבולות: אני חושבת שיש לך מספיק, את זה לא קונים, אני חושבת שאת זה אתה לא צריך (לא יקרה כלום לנפשם הרכה). בדרך זו אנחנו מלמדים אותם ערכים כמו – איפוק, צניעות, הסתפקות במועט, חיסכון.
אנחנו כהורים מבינים מה טובתם של הילדים שלנו לטווח הארוך. הצבת גבולות בכסף לילדינו היא בדיוק זה – לחשוב על הטווח הארוך. מה שנעשה היום, ישפיע על ההתנהלות שלהם בעתיד.
אני נתקלת בהמון אנשים שבגלל התנהלות כלכלית בעייתית של ההורים וחוסר בהצבת גבולות, בכסף ובכלל, מתנהלים בצורה שגויה לאורך שנים, צוברים חובות רבים ולא מסוגלים להרים את הראש מעל למים.

דמי כיס הם היתרון להצבת גבולות לילדינו בתחום הכסף.
מה עושים?
בגיל 5 קונים להם קופה ונותנים להם מדי פעם מטבעות שישלשלו לתוכה.
בגילאי 6-9 כשהם כבר מתחילים ללמוד חשבון, נותנים להם מטבע לרכישת ממתק ועושים חישובים: כמה זה עלה, כמה כסף היה לי, כמה עודף קיבלתי. מעודדים אותם לחסוך (תקנו להם קופה נחמדה) כדי לקנות משהו גדול יותר.
בגילאי 10 ומעלה אפשר להתחיל מתחילים לתת דמי כיס באופן קבוע. כמה לתת? חשוב להבין מה הצורך ולהחליט יחד עם הילד למה בדיוק ישמשו דמי הכיס. עדיין תנו דמי כיס לפי היכולת שלכם ולא רק לפי רצונו של הילד. זה ילמד אותו להתאפק וייתן לו שעור חשוב בדחיית סיפוקים.

מה עוד חשוב לדעת?
אני ממליצה לתמרץ אותם לחסוך – אם תחסוך למשהו גדול שאתה רוצה סכום מסוים – אני אשלים לך את ההפרש. זה מדרבן אותם.
לא להשתמש בדמי הכיס כשוט – התעודה לא משהו, לא תקבל דמי כיס. אין קשר בין שני הדברים.
לא לשלם לילדים עבור ביצוע עבודות בבית – הם חיים בקהילה (המשפחה שלנו) וזה חלק מתרומתם לקהילה בה הם חיים.

מה עושים בחופש הגדול?
אני מגדילה לבנות שלי את דמי הכיס בתקופת החופש הגדול – זה מונע חיכוכים ומריבות. עשו איתם תאום ציפיות – למה משמשים דמי הכיס וגם למה לא. ממליצה לכם לפעול בצורה דומה.

לקראת סיום אני רוצה להמליץ לכם להיכנס לבלוג המקסים של חברתי היקרה עינת ספקטור, מזמינים, לקרוא את הפוסט שלה לחופש הגדול, להדפיס טבלאות לתכנון החופש הגדול וגם סתם להנות ממנו.`,
  },
  {
    id: 7,
    title: "משפחה לא בוחרים",
    thumbnail: "family.jpeg",
    subheading:
      "הגענו אל היישורת האחרונה של החופש הגדול. למרות כל הקיטורים שלי בחודשיים האחרונים, אני די נהנית מזה שיש לבנות שלי חופש.",
    publishingDate: "13.08.2015",
    fullArticale: `הגענו אל היישורת האחרונה של החופש הגדול.

למרות כל הקיטורים שלי בחודשיים האחרונים, אני די נהנית מזה שיש לבנות שלי חופש. לא צריך להעיר אף אחד בבוקר, לא צריך להכין סנדוויצ'ים וגם לא לחכות עם ארוחת צהריים לכל אחת בשעה שהיא מגיעה, והרי לפי חוקי מרפי, במהלך שנת הלימודים כל אחת מהן  מגיעה בשעה אחרת, זה ברור.
אבל יש את הרגעים האלה שאני מרגישה שאני לא יכולה יותר, אין שקט בבית כדי לעבוד, הבלגאן חוגג (ומייצר אצלי הפרעת קשב) ואני משתגעת מהמריבות הבלתי פוסקות שלהן.

ביום שישי האחרון, הזמנתי את אחותי (שגם היא כבר די מאסה בחופש הגדול), לצפות יחד איתי בסרט הצרפתי "משפחה לא בוחרים" שהוקרן בסינמטק בת"א. קיבלתי זוג כרטיסים במתנה והחלטתי שזו הזדמנות מצוינת להתנתק קצת מהנוער הנופש בבית.
הסיפור משעשע למדי – סוג קרייריסטים מוצלחים, הורים ל-3 ילדים מתבגרים טיפוסיים, מחליטים להתגרש. בשל הזדמנויות כאלה ואחרות שצצות לכל אחד מהם בעבודה שלו, הם עושים כל מאמץ על מנת לא לקבל משמורת על הילדים ולגרום לכך שהאחר יהיה זה שיקבל את המשמורת.
מכאן ואילך הסרט רצוף בסצנות משעשעות והזויות למדי של הצעדים שנוקט, כל אחד מבני הזוג, על מנת להשיג את מטרתו – שהילדים יבקשו להיות את ההורה השני.
אני חייבת לציין שאחותי הייתה די המומה מהמקומות אליהם הגיעו בני הזוג במהלך המלחמה ביניהם.

אז בתור גרושה (באושר), אמא ל-3 בנות מתבגרות ובעלת משמורת על הבנות שלי אני חייבת לקחת צעד הצידה ולומר משהו בנימה רצינית:
תהליך הגירושין הוא קשה לכל הצדדים. אם יש ילדים בסיפור, הוא קשה שבעתיים. אני תמיד אומרת לזוגות שמתייעצים איתי, שהדבר הנכון שיש לעשות הוא להניח את האגו בצד ולחשוב רק על טובת הילדים. חישבו עם איזה מטען הם ייצאו מהתהליך, האם זה יבנה אותם או שאולי יהרוס? נסו, למרות שזה קשה מאוד, לשים את עצמכם בנעליו של הצד השני ובכלל חשבו איזה פשרות ניתן לעשות כדי שכולם יסבלו פחות. אני מאמינה שתגלו שכל אלה יעשו את העניין לנסבל יותר.

לסיכומו של עניין אני מציעה שאם אתם בתהליכי גירושין, רק חושבים על האופציה, או אפילו אם אתם נשואים באושר – לכו לצפות בסדר המשעשע הזה, ותלמדו מה לא לעשות 🙂
הסרט יצא לאקרנים ביום ה 10/9 בבתי הקולנוע ברחבי הארץ.`,
  },
  {
    id: 8,
    title: "דברים שלמדתי מאמא שלי על כלכלת המשפחה",
    thumbnail: "mother.jpeg",
    subheading:
      "השבוע חוגגים את יום המשפחה אבל ברשותכם אקרא לו יום האם, כמו שהיה פעם, מזמן, כשאני הייתי ילדה.",
    publishingDate: "07.02.2016",
    fullArticale: `השבוע חוגגים את יום המשפחה אבל ברשותכם אקרא לו יום האם, כמו שהיה פעם, מזמן, כשאני הייתי ילדה.
אז היום אני אמא בעצמי, ל-3 בנות נהדרות אבל מתרפקת קצת על הזכרונות מאז, מזמן.
אני מקדישה את הפוסט הזה לאמא שלי שנפטרה לפני שמונה שנים וקצת.

אמא שלי היתה ניצולת שואה. היא היתה בת 3 כשהמלחמה התחילה והיתה לזה השפעה (כמובן) על כל החיים שלה וכמובן על ניהול הבית שלנו.
בית צנוע:
יש לי 3 אחים ואחות. גדלנו בבית מגונן מאוד, אני תמיד הרגשתי שזה יותר מדי.
גרנו בבית פרטי עם חצר, בימים שרמת השרון היתה מושבה וקטנה ובעצם היתה חור שמגיע אליו אוטובוס בקושי פעם אחת ביום.
הבית עצמו היה בית קטן, 3 חדרי שינה, מקלחת אחת. חדר לבנות, חדר לבנים. הסתדרנו מצויין. אני חושבת שבכלל לא עלתה על דעתי האפשרות שיהיה לי חדר לבד.

אוכל:
אוכל היה עניין מרכזי וחשוב בבית שלנו. ראשית כי לאמא שלי תמיד היה הזיכרון הזה של הרעב בילדותה וכפועל יוצא היא העמיסה את המקרר כך שהיה מפוצץ ותמיד היו כמויות (בלתי סבירות) של אוכל בבית. מה שכן כל החברים שלנו ראו בזה יתרון. בכל שעה נתונה אפשר היה לבוא אלינו ולאכול המון.
לזרוק אוכל היה אסור. אז פעם בכמה זמן, אמא שלי היתה מסדרת את המקרר וכל הגבינות ושאר המצרכים פגי התוקף הוצאו ממנו. זה היה האות ל-2 הכלבים שגידלנו לבוא ולחגוג עם מאכלים מיוחדים.  לחם ישן היה נארז בשקיות ומועבר אחר כבוד לתרנגולות שגידלה בחצרה המנקה שעבדה אצלנו בבית.
כשגדלנו ועזבנו את הבית, נאלצה אמא שלי ללמוד לבשל בסירים קטנים יותר וכמויות קטנות יותר. זה לא היה עניין פשוט בכלל למי שהתרגלה לבשל אוכל טרי מידי יום לגדוד של ילדים וחברים רעבים.

כביסה:
גדוד של ילדים משמעותו הררי כביסה בלתי נגמרים. ככה זה היה אצלנו בבית. מייבש כביסה לא היה, לא ברור לי למה אבל אמא שלי התנגדה לרכישת מייבש ואמרה תמיד שיש המון שמש וצריך לנצל אותה.
לאמא שלי היו סטוקים של סוכר, מלח, אבקת כביסה, רסק עגבניות ועוד ועוד. תמיד צחקנו שאם רמת השרון תהיה במצור – אנחנו לא נרגיש את זה .
כמה שנים אחרי שהיא נפטרה אבא שלי התקשר אלי יום אחד ואמר לי שנגמרה אבקת הכביסה. אוקי, לא הבנתי, מה הבעיה? אז התברר לי שמאז שהיא נפטרה הוא לא קנה אבקת כביסה כי היה סטוק בבית ועכשיו הוא לא יודע מה צריך לקנות. מצחיק.אצבע על הדופק:
אמא שלי היתה בעברה מנהלת חשבונות שהתמסרה לגידול הילדים שלה מאז נולד אחי השני. היא ניהלה את כל ענייני הבית ביד רמה. היא לא דיברה איתנו על  ניהול הכסף אף פעם אבל זה הורגש בבית.
אני זוכרת שהיא היתה שולחת אותי, פעם בכמה ימים, לסניף הבנק להוציא דפי חשבון. זה היה כמובן בימים שלפני הכספומטים. הייתי נערה צעירה, ניגשת לפקידה שכמובן הכירה אותי, והייתי מקבלת ערימת דפים שהיא הדפיסה עבורי.
אני זוכרת שהיא היתה מספרת לי שהמשכנתא שהיא ואבא שלי לקחו בתחילת חייהם המשותפים עשתה אותה חולה כי היא לא יכלה לסבול את העובדה שהם חייבים כסף ושאבא שלי עבד ב-3 עבודות על מנת לשלם את המשכנתא, כמה שיותר מהר, כדי להיפטר מהחוב.

מה אני לקחתי מכל זה?
1. שאני בהחלט יכולה לקנות רק מה שצריך ואין צורך לאגור כמויות של מצרכים בבית.
2. שאני חייבת להיות כל הזמן עם האצבע על הדופק ולדעת מה קורה אצלי בחשבון הבנק.
3. שאני צריכה להיות חרוצה ולעבוד קשה על מנת לממש את החלומות שלי ולא להיות חייבת כלום לאף אחד.
4. לבשל כמויות מדויקות כדי  לא לזרוק אוכל
5. שאפשר להגיד לילדים לא. לא קורה להם כלום – להיפך, הם גדלים בסדר גמור.
6. לא חייבים לגור בבית ענק עם המון חדרים – 2 ילדים יכולים בהחלט לגור בחדר אחד. יש סיכוי שהם יגדלו להיות קצת פחות מפונקים.`,
  },
  {
    id: 9,
    title: "לכבוד מה? לכבוד החנוכה",
    thumbnail: "hanukah.jpeg",
    subheading:
      "חג החנוכה שעומד בפתח הוא החג האהוב עלי. אולי כי נולדתי בנר שמיני של חנוכה, אולי כי אני ממש אוהבת לביבות (והרבה פחות סופגניות).",
    publishingDate: "30.11.2015",
    fullArticale: `חג החנוכה שעומד בפתח הוא החג האהוב עלי. אולי כי נולדתי בנר שמיני של חנוכה, אולי כי אני ממש אוהבת לביבות (והרבה פחות סופגניות). לא ברור. אני רק יודעת שתמיד אהבתי במיוחד את החג הזה.
הבנות שלי מחכות לחנוכה גם בגלל הסופגניות וגם כי זה החג שבו מקבלים דמי חנוכה. כמה תוכניות הן עושות, בשבועות שלפני החג, לבזבוז דמי החנוכה על כל מיני דברים שהן ממש רוצות.

דמי חנוכה הוא אחד המנהגים המקובלים בחג והסיבה למנהג הזה נעוצה ברעיון ללמד את הילדים להרבות בצדקה ובמעשים טובים על מנת להוסיף לחגיגיות החג. כלומר, הכסף שניתן לילדים, מיועד בעצם שיתנו אותו לצדקה. בעבר הרחוק, היוונים שרצו לכפות על האוכלוסייה היהודית את ערכיהם, היו מעוניינים שהיהודים ישתמשו בכספם רק למטרות אנוכיות וטמאות ולא לעניינים רוחניים. דמי החנוכה מסמלים את חגיגת החירות והחופש שלנו לקחת עושר גשמי וחומרי ולהשתמש בו למטרות רוחניות וטהורות (כמו צדקה).
אז כמה רגעים לפני שאתם נותנים לילדים שלכם דמי חנוכה, אני חייבת לשתף אתכם בסיפור קטן הקשור לעניין.

לפני כמה שנים לקחתי את בנותי למופע של הפסטיגל במהלך חג החנוכה. אני למודת ניסיון במופעים האלה יודעת היטב שהמארגנים מנצלים את הקהל השבוי וגובים מחירים מופקעים על כל דבר שנמכר במקום, החל מבקבוק מים ועד מיני צעצועים שונים שנמכרים לפני הכניסה לאולם. אמרתי לבנות שלי לפני שיצאנו מהבית שאני לא מתכוונת לקנות שם כלום. לקחנו בקבוקי מים וחטיפים מהבית. הבנות שלי כבר רגילות לזה.
כשנכנסנו לאולם היכה בנו ריח נפלא של פופקורן חם וטרי. הבת הצעירה שלי נורא רצתה פופקורן. הזכרתי לה שלא קונים כלום והתיישבנו במקום שלנו. בהפסקה היא שוב ביקשה פופקורן. "אני הולכת לבדוק כמה זה עולה" אמרה לי. כשחזרה התברר שכוס (ממש קטנה) של פופקורן עולה 25 ש"ח. מחיר מופקע ממש לכל הדעות.
שוב הסברתי לה שאני לא מתכוונת לקנות לה פופקורן. הקטנה לא התבלבלה והודיעה לי שהיא קיבלה דמי חנוכה מסבא והיא תקנה בהם פופקורן. אני לא הסכמתי לזה.

לפני שאתם מזמינים אלי הביתה את המועצה לשלום הילד, תעצרו שניה. אני לא חושבת שאני אמא מתעללת והבת שלי ממש לא מסכנה. אני חושבת שבדיוק זה התפקיד שלנו כהורים – לכוון אותם.
הסברתי לה שדמי החנוכה שלה מיועדים לקנות לעצמה משחק, ספר בובה, או משהו דומה.
לזה התכוון סבא כשנתן לה אותם. הקטנה הבינה שאני נחושה וויתרה, הוציאה מהתיק ביסקוויטים שהבאנו מהבית ואכלה אותם.
בשלב הזה מישהי שישבה בשורה לפני הסתובבה אלי, הבעת הקלה על פרצופה (כי יש עוד משוגעת אחת באולם שלא קונה שטויות במחירים מופקעים), ואמרה לי – "הכנתי בבית פופקורן כי נורא יקר כאן אבל הילדים שלי לא רוצים לאכול אותו", והציעה לי להתכבד.מה אני מנסה לומר כאן בעצם?

1. שאתם צריכים להיות צרכנים נבונים. כולנו עובדים קשה בשביל הכסף שאנחנו מרוויחים ולכן צריכים להוציא אותו בתבונה.
2. זו האחריות הבלעדית שלנו כהורים ללמד את הילדים שלנו כיצד לבחור על מה כן להוציא כסף ועל מה לא. כאן היתה לי הזדמנות מצויינת ללמד את הקטנה שעור חשוב. היא למדה.
3. אני ממליצה שכשאתם נותנים דמי חנוכה לילדים שלכם, תגדירו בדיוק למה הם משמשים (צעצוע, משחק, בגד וכד') – תאום ציפיות עובד טוב תמיד.

חג חנוכה שמח לכולכם!`,
  },
  {
    id: 10,
    title: "הרהורים על ארוחת החג ומה שמסביב",
    thumbnail: "holidayDinner.jpeg",
    subheading:
      "השנה החדשה כבר כמעט כאן וחלקכם בוודאי עסוקים על מעל לראש בקניות והכנות לקראת החג. כמה רגעים לפני הבישולים והקניות אני רוצה להציע כמה הצעות קטנות.",
    publishingDate: "11.09.2015",
    fullArticale: `השנה החדשה כבר כמעט כאן וחלקכם בוודאי עסוקים על מעל לראש בקניות והכנות לקראת החג.
כמה רגעים לפני הבישולים והקניות אני רוצה להציע כמה הצעות קטנות.

איך זה מתנהל במשפחה שלכם?
לא יודעת מה קורה אצלכם במשפחה אבל אצלנו תמיד נשאר המון אוכל מארוחת החג. בכל שנה אני אומרת לעצמי – זו רק ארוחה ומוצאת את עצמי מבשלת יותר ממה שהתכוונתי כי כל אחד מהמשתתפים רוצה משהו מיוחד. פועל יוצא של זה הוא שחלק מהאוכל נזרק כי למחרת כבר לא בא לנו לאכול את אותו אוכל, חג, רוצים גיוון. חלק מהרעיון של המון אוכל והמון סוגים של אוכל הוא העניין שאנחנו מאחלים לעצמנו שתהיה שנה טובה ושנה של שפע. הכנתי רשימה קצרה של כללים כדי להיות יעילים ולא בזבזניים:
1. עצרו רגע וחשבו – האם באמת יאכלו את כל הכמויות או שאפשר לקצץ בהן קצת? מכינים אוכל לברכות החג? הכינו טעימות שיספיקו לכולם. לא צריך יותר מזה.
2. תבדקו מי אוכל כל אחד מסוגי האוכל.
במשפחה שלי למשל יש רק 2 אנשים שאוכלים דג. כל השאר לא אוהבים את זה בכלל.
הפיתרון שאנחנו מצאנו – קונים 4 קציצות, יותר זול, הרבה פחות עבודה ולא נשאר כלום.
3. הציעו לכל אחד מהמשתתפים בארוחה לקחת חלק בדרך הכי מתאימה לו – אחד עם בית גדול ינדב את הבית, אחד מכין אורז הכי טעים, יכין אורז, מי שטוב בהכנת קינוחים, יכין קינוחים, חלקו מטלות לכל המשתתפים. כך תהנו מגיוון, תבזבזו פחות וגם תוכלו קצת לנוח לפני הארוחה. מנוחה עושה טוב לעור הפנים 🙂

אז מה שנשאר זה רק להזכיר לכם שארוחת החג היא בעצם הזדמנות לשבת עם כל המשפחה ולהנות ממנה, האוכל חשוב אבל הוא רק אמצעי לקרב לבבות.

אני מבקשת לאחל לכולכם שנה טובה. שתהיה זו שנה של שפע ושגשוג, בריאות טובה והצלחה בכל מה שתבקשו לעצמכם.`,
  },
];
function jsonLoop() {
  const listContainer = document.getElementById("blogListContainer");
  if (!listContainer) {
    console.error('The container with ID "blogListContainer" was not found.'); //מציג הודעה במידה שאין קונטיינר שתואם לבלוג
    return;
  }

  // מרוקן את הרשימה
  listContainer.innerHTML = "";

  // יוצר שורה של בלוגים
  const row = document.createElement("div");
  row.className = "row";
  //יצירה של הבלוגים
  blogs.forEach((blog, index) => {
    const col = document.createElement("div"); //יצירה של דיב
    col.className = "col-md-4 col-sm-6 col-12 mb-4 100px"; //מתן קלאס של בוטסטראפ

    const card = document.createElement("div"); //יצירה של כרטיס
    card.className = "card h-100 card-margin"; //קלאס של כרטיס של בוטסטראפ

    const img = document.createElement("img"); //יצרירה תמונה
    img.src = `images/${blog.thumbnail}`; //לקיחת מקור התמונה בהתאם לבלוג
    img.className = "card-img-top"; // להוספת קלאס של בוטסטראפ לתמונה
    img.alt = blog.title;
    card.appendChild(img);

    // יוצר את גוף הכרטיס
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // מוסיף כותרת לגוף הכרטיס
    const title = document.createElement("h5");
    title.className = "card-title d-flex flex-column";
    title.textContent = blog.title;
    cardBody.appendChild(title);

    //מוסיף תת כותרת לגוף הכרטיס
    const subheading = document.createElement("p");
    subheading.className = "card-subtitle mb-2 text-muted";
    subheading.textContent = blog.subheading;
    cardBody.appendChild(subheading);

    // מוסיף תאריך לגוף הכרטיס
    const date = document.createElement("p");
    date.className = "card-text";
    date.textContent = blog.publishingDate;
    cardBody.appendChild(date);

    // יוצר את כפתור לכתבה המלאה
    const fullArticleButton = document.createElement("button");
    fullArticleButton.className = "toArticleBtn mt-auto align-self-start";
    fullArticleButton.textContent = "לכתבה המלאה";
    fullArticleButton.role = "button";
    fullArticleButton.setAttribute("data-blog-id", blog.id.toString());

    cardBody.appendChild(fullArticleButton);
    card.appendChild(cardBody);

    col.appendChild(card);

    row.appendChild(col);
  });

  // לשורה append עושה
  listContainer.appendChild(row);
  const fullArticleButtons = document.querySelectorAll(".toArticleBtn");
// עובר על כל כפתור של מאמר מלא
  fullArticleButtons.forEach((button) => {
      // מוסיף אירוע לחיצה לכל כפתור
    button.addEventListener("click", function () {
      const blogId = this.getAttribute("data-blog-id");
    // מוצא את הנתונים של הבלוג בהתאם לכפתור שנלחץ
    const blog = blogs.find((blog) => blog.id.toString() === blogId);

      if (blog) {
        // Now set the content of the modal based on the `blog` found
        const modalTitle = document.querySelector("#articleModalLabel");
        const modalFullArticle = document.querySelector(
          "#articleModal .modal-body p"
        );

        modalTitle.textContent = blog.title; // מגדיר את כותרת המודל לכותרת הבלוג
        modalFullArticle.textContent = blog.fullArticale;// מגדיר את תוכן המודל למאמר המלא של הבלוג
        modalFullArticle.classList.add("full-article");// מוסיף קלאס לתוכן
        modalTitle.classList.add("full-article-popup");// מוסיף קלאס לכותרת

        var modalElement = document.getElementById("articleModal");
        var modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show(); // מציג את המודל
      } else {
        console.error("Blog not found!");// הדפסת שגיאה אם הבלוג לא נמצא
      }
    });
  });
}
function openNav() {
  // פותח את התפריט צד במידה וגודל המסך קטן ממסך ווב
  if (window.innerWidth < 769) {
    document.getElementById("mySidebar").style.width = "250px";
  }
}
//סוגר את הפתריט צד
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

// סוגר את התפריט צד במידה וגודל המסך גדול מגודל של מובייל 
function autoCloseNavOnResize() {
  if (window.innerWidth > 769) {
    closeNav();
  }
}

//בודק את גודל המסך
window.addEventListener("resize", autoCloseNavOnResize);

// קורא לפונקציה שסוגרת את התפריט צד אוטומטית 
document.addEventListener("DOMContentLoaded", autoCloseNavOnResize);
