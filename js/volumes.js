(function () {
/**
 * Single source of truth for the actual PDFs supplied with this project.
 * pdfPath and fileName preserve the original filenames. Paths are resolved
 * relative to the site root; do not scan directories in browser JavaScript.
 * pageCount is verified from each supplied PDF and is used by the native-viewer fallback.
 * `toc` is empty until verified contents are entered; the reader prefers embedded PDF outlines.
 */
const volumes = [
  {
    id: "y1-vol-1",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 1",
    volumeLabel: "Vol 1",
    pdfPath: "./Y1/COTE Year 1 Vol 1.pdf",
    fileName: "COTE Year 1 Vol 1.pdf",
    coverPath: "./assets/covers/y1-vol-1.jpg",
    toc: [{"title":"Table of Contents","page":2,"depth":0},{"title":"Character Gallery","page":3,"depth":0},{"title":"Table of Contents Page","page":10,"depth":0},{"title":"Title Page","page":11,"depth":0},{"title":"Credits and Copyright","page":12,"depth":0},{"title":"Chapter 1: The Structure of Japanese Society","page":14,"depth":0},{"title":"Chapter 2: Welcome to the School Life of Your Dreams","page":16,"depth":0},{"title":"Chapter 3: The Students of D Class","page":54,"depth":0},{"title":"Chapter 4: Ladies and Gentlemen, Thank You for Waiting","page":72,"depth":0},{"title":"Chapter 5: Friends","page":89,"depth":0},{"title":"Chapter 6: The End of Everyday Life","page":102,"depth":0},{"title":"Chapter 7: Classroom of the Elite","page":120,"depth":0},{"title":"Chapter 8: The Association of Failures","page":152,"depth":0},{"title":"Chapter 9: The Failures Mobilize Once Again","page":203,"depth":0},{"title":"Chapter 10: Midterm Exam","page":236,"depth":0},{"title":"Chapter 11: The Beginning","page":246,"depth":0},{"title":"Chapter 12: Victory Celebration","page":256,"depth":0},{"title":"Postscript","page":263,"depth":0},{"title":"Newsletter","page":13,"depth":0}],
    pageCount: 264
  },
  {
    id: "y1-vol-2",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 2",
    volumeLabel: "Vol 2",
    pdfPath: "./Y1/COTE Year 1 Vol 2.pdf",
    fileName: "COTE Year 1 Vol 2.pdf",
    coverPath: "./assets/covers/y1-vol-2.jpg",
    toc: [{"title":"Table of Contents","page":2,"depth":0},{"title":"Character Gallery","page":3,"depth":0},{"title":"Table of Contents Page","page":7,"depth":0},{"title":"Title Page","page":8,"depth":0},{"title":"Copyrights and Credits","page":9,"depth":0},{"title":"Chapter 1: Sakura Airi’s Soliloquy","page":10,"depth":0},{"title":"Chapter 2: The Sudden Beginning of Our Tumultuous Troubles","page":12,"depth":0},{"title":"Chapter 3: Weak Point","page":40,"depth":0},{"title":"Chapter 4: An Unexpected Witness","page":66,"depth":0},{"title":"Chapter 5: Each and Every Prediction","page":151,"depth":0},{"title":"Chapter 6: Truth and Lies","page":189,"depth":0},{"title":"Chapter 7: Only One Solution","page":219,"depth":0},{"title":"Postscript","page":258,"depth":0},{"title":"About the Author and Illustrator","page":260,"depth":0},{"title":"Newsletter","page":261,"depth":0}],
    pageCount: 261
  },
  {
    id: "y1-vol-3",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 3",
    volumeLabel: "Vol 3",
    pdfPath: "./Y1/COTE Year 1 Vol 3.pdf",
    fileName: "COTE Year 1 Vol 3.pdf",
    coverPath: "./assets/covers/y1-vol-3.jpg",
    toc: [{"title":"Table of Contents","page":2,"depth":0},{"title":"Chapter 1: Chabashira Sae’s Soliloquy","page":10,"depth":0},{"title":"Chapter 2: The Boundary Between Heaven and Hell","page":13,"depth":0},{"title":"Chapter 3: Rivals on the Move","page":100,"depth":0},{"title":"Chapter 4: The Meaning of Freedom","page":131,"depth":0},{"title":"Chapter 5: The Quiet Outbreak of War","page":144,"depth":0},{"title":"Chapter 6: False Teamwork","page":159,"depth":0},{"title":"Chapter 7: The Curtain Rises","page":240,"depth":0},{"title":"Postscript","page":259,"depth":0},{"title":"About the Author and Illustrator","page":261,"depth":0},{"title":"Newsletter","page":262,"depth":0}],
    pageCount: 262
  },
  {
    id: "y1-vol-4",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 4",
    volumeLabel: "Vol 4",
    pdfPath: "./Y1/COTE Year 1 Vol 4.pdf",
    fileName: "COTE Year 1 Vol 4.pdf",
    coverPath: "./assets/covers/y1-vol-4.jpg",
    toc: [{"title":"Table of Contents","page":2,"depth":0},{"title":"Character Gallery","page":3,"depth":0},{"title":"Table of Contents Page","page":7,"depth":0},{"title":"Title Page","page":8,"depth":0},{"title":"Copyrights and Credits","page":9,"depth":0},{"title":"Chapter 1: Karuizawa Kei’s Soliloquy","page":10,"depth":0},{"title":"Chapter 2: The Gentle Days…","page":12,"depth":0},{"title":"Chapter 3: An Infinite Variety of Wishes","page":63,"depth":0},{"title":"Chapter 4: Double Question","page":125,"depth":0},{"title":"Chapter 5: Each and Every Difference","page":205,"depth":0},{"title":"Postscript","page":244,"depth":0},{"title":"About the Author and Illustrator","page":247,"depth":0},{"title":"Newsletter","page":248,"depth":0}],
    pageCount: 248
  },
  {
    id: "y1-vol-4-5",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 4.5",
    volumeLabel: "Vol 4.5",
    pdfPath: "./Y1/COTE Year 1 Vol 4.5.pdf",
    fileName: "COTE Year 1 Vol 4.5.pdf",
    coverPath: "./assets/covers/y1-vol-4-5.jpg",
    toc: [{"title":"Table of Contents","page":2,"depth":0},{"title":"Character Gallery","page":3,"depth":0},{"title":"Table of Contents Page","page":7,"depth":0},{"title":"Title Page","page":8,"depth":0},{"title":"Copyrights and Credits","page":9,"depth":0},{"title":"Chapter 1: Summer Vacation is Nearly Over","page":10,"depth":0},{"title":"Chapter 2: Ibuki Mio has Surprisingly Good Sense","page":11,"depth":0},{"title":"Chapter 3: Katsuragi Kouhei is Surprisingly Troubled","page":49,"depth":0},{"title":"Chapter 4: Dangers Lurk in Everyday Life","page":108,"depth":0},{"title":"Chapter 5: A Day of Girl Troubles and Disaster: A Devil Smiles Like an Angel","page":132,"depth":0},{"title":"Chapter 6: A Gathering Between Classes","page":153,"depth":0},{"title":"Chapter 7: Ike, Yamauchi, and Sudou’s Summer Vacation (Extra Stories)","page":205,"depth":0},{"title":"Postscript","page":224,"depth":0},{"title":"About the Author and Illustrator","page":226,"depth":0},{"title":"Newsletter","page":227,"depth":0}],
    pageCount: 227
  },
  {
    id: "y1-vol-5",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 5",
    volumeLabel: "Vol 5",
    pdfPath: "./Y1/COTE Year 1 Vol 5.pdf",
    fileName: "COTE Year 1 Vol 5.pdf",
    coverPath: "./assets/covers/y1-vol-5.jpg",
    toc: [{"title":"Table of Contents","page":2,"depth":0},{"title":"Character Gallery","page":3,"depth":0},{"title":"Table of Contents Page","page":7,"depth":0},{"title":"Title Page","page":8,"depth":0},{"title":"Copyrights and Credits","page":9,"depth":0},{"title":"Chapter 1: Sudou Ken’s Soliloquy","page":11,"depth":0},{"title":"Chapter 2: The School Sports Festival Begins","page":13,"depth":0},{"title":"Chapter 3: Class D’s Objective","page":39,"depth":0},{"title":"Chapter 4: Everyone’s Calculations","page":54,"depth":0},{"title":"Chapter 5: There’s a Reason for Their Relationship","page":68,"depth":0},{"title":"Chapter 6: The Curtains Rise","page":86,"depth":0},{"title":"Chapter 7: For Whose Sake?","page":144,"depth":0},{"title":"Chapter 8: What You and I Lack","page":160,"depth":0},{"title":"Chapter 9: The Turning Point","page":181,"depth":0},{"title":"Postscript","page":205,"depth":0},{"title":"About the Author and Illustrator","page":206,"depth":0},{"title":"Newsletter","page":207,"depth":0}],
    pageCount: 207
  },
  {
    id: "y1-vol-6",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 6",
    volumeLabel: "Vol 6",
    pdfPath: "./Y1/COTE Year 1 Vol 6.pdf",
    fileName: "COTE Year 1 Vol 6.pdf",
    coverPath: "./assets/covers/y1-vol-6.jpg",
    toc: [{"title":"Character Gallery","page":3,"depth":0},{"title":"Table of Contents Page","page":7,"depth":0},{"title":"Title Page","page":8,"depth":0},{"title":"Copyrights and Credits","page":9,"depth":0},{"title":"Chapter 1: Kushida Kikyou’s Soliloquy","page":10,"depth":0},{"title":"Chapter 2: The Changing Class D","page":14,"depth":0},{"title":"Chapter 3: The Paper Shuffle","page":30,"depth":0},{"title":"Chapter 4: Class C Makes Its Move","page":60,"depth":0},{"title":"Chapter 5: A Means of Escape","page":76,"depth":0},{"title":"Chapter 6: The Ayanokouji Group’s Formation","page":132,"depth":0},{"title":"Chapter 7: A Difference in Determination","page":177,"depth":0},{"title":"Postscript","page":210,"depth":0},{"title":"Newsletter","page":211,"depth":0}],
    pageCount: 211
  },
  {
    id: "y1-vol-7",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 7",
    volumeLabel: "Vol 7",
    pdfPath: "./Y1/COTE Year 1 Vol 7.pdf",
    fileName: "COTE Year 1 Vol 7.pdf",
    coverPath: "./assets/covers/y1-vol-7.jpg",
    toc: [{"title":"Table of Contents","page":10,"depth":0},{"title":"Character Gallery","page":2,"depth":0},{"title":"Table of Contents Page","page":6,"depth":0},{"title":"Title Page","page":7,"depth":0},{"title":"Copyrights and Credits","page":8,"depth":0},{"title":"Chapter 1: Ryuuen Kakeru’s Soliloquy","page":11,"depth":0},{"title":"Chapter 2: The Sound of Footsteps in the Middle of Winter","page":14,"depth":0},{"title":"Chapter 3: Reunions and Farewells","page":32,"depth":0},{"title":"Chapter 4: Insanity","page":98,"depth":0},{"title":"Chapter 5: Time to Settle Things","page":120,"depth":0},{"title":"Chapter 6: Intersecting Thoughts","page":152,"depth":0},{"title":"Chapter 7: What Ryuuen Wins and Loses","page":197,"depth":0},{"title":"Postscript","page":206,"depth":0},{"title":"Newsletter","page":207,"depth":0}],
    pageCount: 207
  },
  {
    id: "y1-vol-7-5",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 7.5",
    volumeLabel: "Vol 7.5",
    pdfPath: "./Y1/COTE Year 1 Vol 7.5.pdf",
    fileName: "COTE Year 1 Vol 7.5.pdf",
    coverPath: "./assets/covers/y1-vol-7-5.jpg",
    toc: [{"title":"Table of Contents","page":10,"depth":0},{"title":"Character Gallery","page":2,"depth":0},{"title":"Table of Contents Page","page":6,"depth":0},{"title":"Title Page","page":7,"depth":0},{"title":"Copyrights and Credits","page":8,"depth":0},{"title":"Chapter 1: First Winter","page":11,"depth":0},{"title":"Chapter 2: Love’s Arrow","page":12,"depth":0},{"title":"Chapter 3: Ibuki Mio’s Disastrous Day","page":35,"depth":0},{"title":"Chapter 4: How We Spend Our Time","page":73,"depth":0},{"title":"Chapter 5: The Turbulent Double Date","page":107,"depth":0},{"title":"Chapter 6: Where the Arrow Landed","page":154,"depth":0},{"title":"Postscript","page":171,"depth":0},{"title":"Newsletter","page":172,"depth":0}],
    pageCount: 172
  },
  {
    id: "y1-vol-8",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 8",
    volumeLabel: "Vol 8",
    pdfPath: "./Y1/COTE Year 1 Vol 8.pdf",
    fileName: "COTE Year 1 Vol 8.pdf",
    coverPath: "./assets/covers/y1-vol-8.jpg",
    toc: [{"title":"Table of Contents","page":9,"depth":0},{"title":"Character Gallery","page":2,"depth":0},{"title":"Table of Contents Page","page":6,"depth":0},{"title":"Title Page","page":7,"depth":0},{"title":"Copyrights and Credits","page":8,"depth":0},{"title":"Chapter 1: Horikita Manabu’s Soliloquy","page":10,"depth":0},{"title":"Chapter 2: A New Special Exam: Mixed Training Camp","page":11,"depth":0},{"title":"Chapter 3: Human Nature Put to the Test","page":77,"depth":0},{"title":"Chapter 4: A Premonition of Defeat","page":110,"depth":0},{"title":"Chapter 5: The First Half of the Girls’ Battle: Ichinose Honami","page":148,"depth":0},{"title":"Chapter 6: Ubiquitous Things","page":153,"depth":0},{"title":"Chapter 7: What Is Lost, What Isn’t","page":186,"depth":0},{"title":"Chapter 8: The Second Half of the Girls’ Battle: Horikita Suzune","page":212,"depth":0},{"title":"Chapter 9: Blind Spot","page":216,"depth":0},{"title":"Postscript","page":242,"depth":0},{"title":"Newsletter","page":244,"depth":0}],
    pageCount: 244
  },
  {
    id: "y1-vol-9",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 9",
    volumeLabel: "Vol 9",
    pdfPath: "./Y1/COTE Year 1 Vol 9.pdf",
    fileName: "COTE Year 1 Vol 9.pdf",
    coverPath: "./assets/covers/y1-vol-9.jpg",
    toc: [],
    pageCount: 238
  },
  {
    id: "y1-vol-10",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 10",
    volumeLabel: "Vol 10",
    pdfPath: "./Y1/COTE Year 1 Vol 10.pdf",
    fileName: "COTE Year 1 Vol 10.pdf",
    coverPath: "./assets/covers/y1-vol-10.jpg",
    toc: [{"title":"Illustrations","page":2,"depth":0},{"title":"Prologue","page":6,"depth":0},{"title":"Chapter 1: The Calm Before the Storm","page":11,"depth":0},{"title":"Chapter 2: “The Class Vote”","page":30,"depth":0},{"title":"Chapter 3: The Difficulty of Salvation","page":85,"depth":0},{"title":"Chapter 4: Brother and Sister","page":148,"depth":0},{"title":"Chapter 5: Good and Evil","page":182,"depth":0},{"title":"Chapter 6: “The Other Classes’ Ideas”","page":238,"depth":0},{"title":"Epilogue: “The Dropouts”","page":286,"depth":0},{"title":"Afterword","page":363,"depth":0},{"title":"Short Stories","page":365,"depth":0}],
    pageCount: 376
  },
  {
    id: "y1-vol-11",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 11",
    volumeLabel: "Vol 11",
    pdfPath: "./Y1/COTE Year 1 Vol 11.pdf",
    fileName: "COTE Year 1 Vol 11.pdf",
    coverPath: "./assets/covers/y1-vol-11.jpg",
    toc: [],
    pageCount: 476
  },
  {
    id: "y1-vol-11-5",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 11.5",
    volumeLabel: "Vol 11.5",
    pdfPath: "./Y1/COTE Year 1 Vol 11.5.pdf",
    fileName: "COTE Year 1 Vol 11.5.pdf",
    coverPath: "./assets/covers/y1-vol-11-5.jpg",
    toc: [{"title":"Prologue","page":8,"depth":0},{"title":"Chapter 1 - Graduation Ceremony","page":13,"depth":0},{"title":"Chapter 2 - Date Hiyori","page":121,"depth":0},{"title":"Chapter 3 - Lost Lamb","page":144,"depth":0},{"title":"Chapter 4 - From a Brother to a Sister","page":237,"depth":0},{"title":"Chapter 5 - Matsushita suspicion","page":296,"depth":0},{"title":"Epilogue - Youth is About to Bloom","page":352,"depth":0},{"title":"Ichinose Honami – The Second Chapter is about to Begin","page":375,"depth":0},{"title":"Shiina Hiyori – By Reading Books","page":378,"depth":0},{"title":"Matsushita Chiaki – Mind Games","page":381,"depth":0},{"title":"Sakayanagi Arisu – A Prediction of the Future","page":385,"depth":0},{"title":"Ryuuen Kakeru – What Became Apparent to Me After a Year -Ryuuen Kakeru-","page":388,"depth":0},{"title":"Karuizawa Kei Artbook SS – The Person Who Became Dear to Me","page":406,"depth":0}],
    pageCount: 423
  },
  {
    id: "y1-vol-11-75",
    year: "Y1",
    title: "Classroom of the Elite — Year 1 Vol 11.75",
    volumeLabel: "Vol 11.75",
    pdfPath: "./Y1/COTE Year 1 Vol 11.75.pdf",
    fileName: "COTE Year 1 Vol 11.75.pdf",
    coverPath: "./assets/covers/y1-vol-11-75.jpg",
    toc: [{"title":"Ayanokouji Kiyotaka SS – The First Phone Call","page":3,"depth":0},{"title":"Ichinose Honami SS – Ichinose Honami’s Spring Vacation","page":15,"depth":0}],
    pageCount: 18
  },
  {
    id: "y2-vol-1",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 1",
    volumeLabel: "Vol 1",
    pdfPath: "./Y2/COTE Year 2 Vol 1.pdf",
    fileName: "COTE Year 2 Vol 1.pdf",
    coverPath: "./assets/covers/y2-vol-1.jpg",
    toc: [{"title":"Prologue: Operating Behind the Scenes","page":7,"depth":0},{"title":"Chapter 1: True Ability","page":12,"depth":0},{"title":"Chapter 2: A New Stage","page":16,"depth":0},{"title":"Intro","page":17,"depth":1},{"title":"Part 1","page":25,"depth":1},{"title":"Part 2","page":40,"depth":1},{"title":"Part 3","page":53,"depth":1},{"title":"Part 4","page":57,"depth":1},{"title":"Chapter 3: The Problematic Group of First-Years","page":66,"depth":0},{"title":"Intro","page":67,"depth":1},{"title":"Part 1","page":76,"depth":1},{"title":"Part 2","page":84,"depth":1},{"title":"Part 3","page":111,"depth":1},{"title":"Chapter 4: Ichika’s Test","page":142,"depth":0},{"title":"Intro","page":143,"depth":1},{"title":"Part 1","page":147,"depth":1},{"title":"Part 2","page":156,"depth":1},{"title":"Part 3","page":163,"depth":1},{"title":"Part 4","page":167,"depth":1},{"title":"Part 5","page":173,"depth":1},{"title":"Part 6","page":184,"depth":1},{"title":"Part 7","page":194,"depth":1},{"title":"Part 8","page":200,"depth":1},{"title":"Chapter 5: Class D and Class D","page":204,"depth":0},{"title":"Intro","page":205,"depth":1},{"title":"Part 1","page":222,"depth":1},{"title":"Part 2","page":227,"depth":1},{"title":"Part 3","page":232,"depth":1},{"title":"Part 4","page":245,"depth":1},{"title":"Part 5","page":250,"depth":1},{"title":"Part 6","page":261,"depth":1},{"title":"Part 7","page":264,"depth":1},{"title":"Part 8","page":268,"depth":1},{"title":"Part 9","page":276,"depth":1},{"title":"Chapter 6: The Sound of Expulsion","page":286,"depth":0},{"title":"Intro","page":287,"depth":1},{"title":"Part 1","page":294,"depth":1},{"title":"Part 2","page":311,"depth":1},{"title":"Part 3","page":338,"depth":1},{"title":"Epilogue: An Intensifying Mystery","page":344,"depth":0},{"title":"Intro","page":345,"depth":1},{"title":"Part 1","page":349,"depth":1},{"title":"Afterword","page":358,"depth":0},{"title":"Short Stories","page":359,"depth":0},{"title":"SS Horikita Suzune: What’s the Fuss About My Hair?","page":360,"depth":1},{"title":"SS Karuizawa Kei: A Time for Them Alone","page":362,"depth":1},{"title":"SS Nanase Tsubasa: What is Reflected in Her Eyes","page":364,"depth":1},{"title":"SS Nanase Tsubasa Tapestry: The Voice in My Heart","page":368,"depth":1}],
    pageCount: 369
  },
  {
    id: "y2-vol-2",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 2",
    volumeLabel: "Vol 2",
    pdfPath: "./Y2/COTE Year 2 Vol 2.pdf",
    fileName: "COTE Year 2 Vol 2.pdf",
    coverPath: "./assets/covers/y2-vol-2.jpg",
    toc: [{"title":"Illustration","page":2,"depth":0},{"title":"Prologue: The White Room student’s monologue","page":6,"depth":0},{"title":"Chapter 1: School life is changing","page":11,"depth":0},{"title":"Chapter 2: The flowing passage of time","page":64,"depth":0},{"title":"Chapter 3: Summer’s approaching, premonition of a fierce battle","page":109,"depth":0},{"title":"Chapter 4: The battle of the 1st and 3rd years","page":219,"depth":0},{"title":"Chapter 5: An Invitation","page":293,"depth":0},{"title":"Epilogue: The Calm Before the Storm","page":326,"depth":0},{"title":"Afterword","page":339,"depth":0},{"title":"Short Stories","page":341,"depth":0}],
    pageCount: 354
  },
  {
    id: "y2-vol-3",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 3",
    volumeLabel: "Vol 3",
    pdfPath: "./Y2/COTE Year 2 Vol 3.pdf",
    fileName: "COTE Year 2 Vol 3.pdf",
    coverPath: "./assets/covers/y2-vol-3.jpg",
    toc: [],
    pageCount: 368
  },
  {
    id: "y2-vol-4",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 4",
    volumeLabel: "Vol 4",
    pdfPath: "./Y2/COTE Year 2 Vol 4.pdf",
    fileName: "COTE Year 2 Vol 4.pdf",
    coverPath: "./assets/covers/y2-vol-4.jpg",
    toc: [],
    pageCount: 284
  },
  {
    id: "y2-vol-4-5",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 4.5",
    volumeLabel: "Vol 4.5",
    pdfPath: "./Y2/COTE Year 2 Vol 4.5.pdf",
    fileName: "COTE Year 2 Vol 4.5.pdf",
    coverPath: "./assets/covers/y2-vol-4-5.jpg",
    toc: [{"title":"Color Illustrations","page":2,"depth":0},{"title":"Prologue: Raising the Curtain on a Fun Summer Vacation","page":10,"depth":0},{"title":"Chapter 1: With Ike and Komiya","page":12,"depth":0},{"title":"1.1","page":22,"depth":1},{"title":"1.2","page":26,"depth":1},{"title":"Chapter 2: The Beginning of the Short-Lived Vacation","page":36,"depth":0},{"title":"2.1","page":54,"depth":1},{"title":"2.2","page":58,"depth":1},{"title":"2.3","page":64,"depth":1},{"title":"Chapter 3: Everyone’s Days Off","page":73,"depth":0},{"title":"3.1","page":77,"depth":1},{"title":"3.2","page":81,"depth":1},{"title":"3.3","page":86,"depth":1},{"title":"3.4","page":89,"depth":1},{"title":"Chapter 4: The Growth in Each of Us","page":96,"depth":0},{"title":"4.1","page":106,"depth":1},{"title":"4.2","page":113,"depth":1},{"title":"4.3","page":117,"depth":1},{"title":"4.4","page":128,"depth":1},{"title":"4.5","page":135,"depth":1},{"title":"4.6","page":151,"depth":1},{"title":"Chapter 5: A Treasure Hunt Game Filled With Women Troubles","page":159,"depth":0},{"title":"5.1","page":160,"depth":1},{"title":"5.2","page":166,"depth":1},{"title":"5.3","page":176,"depth":1},{"title":"5.4","page":181,"depth":1},{"title":"5.5","page":191,"depth":1},{"title":"5.6","page":193,"depth":1},{"title":"5.7","page":204,"depth":1},{"title":"5.8","page":206,"depth":1},{"title":"5.9","page":211,"depth":1},{"title":"Chapter 6: An Inevitable Past","page":217,"depth":0},{"title":"6.1","page":224,"depth":1},{"title":"6.2","page":236,"depth":1},{"title":"6.3","page":251,"depth":1},{"title":"6.4","page":257,"depth":1},{"title":"Epilogue: When Hearts Touch One Another","page":268,"depth":0},{"title":"Afterword","page":275,"depth":0},{"title":"Karuizawa Kei SS: A Dream I Have Seen Before","page":277,"depth":0},{"title":"Satou Maya SS: A Bad Girl, But Just a Little Bit","page":279,"depth":0},{"title":"Nanase Tsubasa SS: A Double-sided Favour Repayment","page":283,"depth":0},{"title":"Sakayanagi Arisu SS: Sakayanagi’s Unexpected Assessment","page":287,"depth":0},{"title":"Kiryuuin Fuuka SS: When You are the Older One","page":289,"depth":0}],
    pageCount: 290
  },
  {
    id: "y2-vol-5",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 5",
    volumeLabel: "Vol 5",
    pdfPath: "./Y2/COTE Year 2 Vol 5.pdf",
    fileName: "COTE Year 2 Vol 5.pdf",
    coverPath: "./assets/covers/y2-vol-5.jpg",
    toc: [],
    pageCount: 243
  },
  {
    id: "y2-vol-6",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 6",
    volumeLabel: "Vol 6",
    pdfPath: "./Y2/COTE Year 2 Vol 6.pdf",
    fileName: "COTE Year 2 Vol 6.pdf",
    coverPath: "./assets/covers/y2-vol-6.jpg",
    toc: [{"title":"Color Illustrations","page":1,"depth":0},{"title":"Prologue","page":1,"depth":0},{"title":"Chapter 1","page":15,"depth":0},{"title":"Introduction","page":15,"depth":1},{"title":"1","page":26,"depth":1},{"title":"2","page":48,"depth":1},{"title":"3","page":59,"depth":1},{"title":"Chapter 2","page":64,"depth":0},{"title":"Introduction","page":64,"depth":1},{"title":"1","page":67,"depth":1},{"title":"2","page":90,"depth":1},{"title":"3","page":98,"depth":1},{"title":"Chapter 3","page":101,"depth":0},{"title":"Introduction","page":101,"depth":1},{"title":"1","page":112,"depth":1},{"title":"2","page":146,"depth":1},{"title":"3","page":155,"depth":1},{"title":"4","page":170,"depth":1},{"title":"5","page":176,"depth":1},{"title":"Chapter 4","page":194,"depth":0},{"title":"Introduction","page":194,"depth":1},{"title":"1","page":219,"depth":1},{"title":"2","page":223,"depth":1},{"title":"3","page":234,"depth":1},{"title":"4","page":238,"depth":1},{"title":"Chapter 5","page":241,"depth":0},{"title":"Introduction","page":241,"depth":1},{"title":"1","page":245,"depth":1},{"title":"2","page":250,"depth":1},{"title":"3","page":258,"depth":1},{"title":"4","page":268,"depth":1},{"title":"5","page":279,"depth":1},{"title":"6","page":286,"depth":1},{"title":"Chapter 6","page":302,"depth":0},{"title":"Introduction","page":302,"depth":1},{"title":"1","page":318,"depth":1},{"title":"2","page":323,"depth":1},{"title":"Epilogue","page":327,"depth":0},{"title":"Afterword","page":331,"depth":0},{"title":"Sakayanagi Arisu SS: Complicated Feelings","page":333,"depth":0},{"title":"Chabashira Sae SS: Something That Can’t be Forgiven","page":336,"depth":0},{"title":"Amasawa Ichika SS: The Truth is, I’ve Always","page":339,"depth":0},{"title":"Onodera Kayano SS: That’s What I Believe In","page":342,"depth":0},{"title":"Credits","page":345,"depth":0},{"title":"Translator’s Notes","page":1,"depth":0}],
    pageCount: 346
  },
  {
    id: "y2-vol-7",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 7",
    volumeLabel: "Vol 7",
    pdfPath: "./Y2/COTE Year 2 Vol 7.pdf",
    fileName: "COTE Year 2 Vol 7.pdf",
    coverPath: "./assets/covers/y2-vol-7.jpg",
    toc: [],
    pageCount: 207
  },
  {
    id: "y2-vol-8",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 8",
    volumeLabel: "Vol 8",
    pdfPath: "./Y2/COTE Year 2 Vol 8.pdf",
    fileName: "COTE Year 2 Vol 8.pdf",
    coverPath: "./assets/covers/y2-vol-8.jpg",
    toc: [],
    pageCount: 208
  },
  {
    id: "y2-vol-9",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 9",
    volumeLabel: "Vol 9",
    pdfPath: "./Y2/COTE Year 2 Vol 9.pdf",
    fileName: "COTE Year 2 Vol 9.pdf",
    coverPath: "./assets/covers/y2-vol-9.jpg",
    toc: [],
    pageCount: 225
  },
  {
    id: "y2-vol-9-5",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 9.5",
    volumeLabel: "Vol 9.5",
    pdfPath: "./Y2/COTE Year 2 Vol 9.5.pdf",
    fileName: "COTE Year 2 Vol 9.5.pdf",
    coverPath: "./assets/covers/y2-vol-9-5.jpg",
    toc: [],
    pageCount: 219
  },
  {
    id: "y2-vol-9-75",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 9.75",
    volumeLabel: "Vol 9.75",
    pdfPath: "./Y2/COTE Year 2 Vol 9.75.pdf",
    fileName: "COTE Year 2 Vol 9.75.pdf",
    coverPath: "./assets/covers/y2-vol-9-75.jpg",
    toc: [],
    pageCount: 17
  },
  {
    id: "y2-vol-10",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 10",
    volumeLabel: "Vol 10",
    pdfPath: "./Y2/COTE Year 2 Vol 10.pdf",
    fileName: "COTE Year 2 Vol 10.pdf",
    coverPath: "./assets/covers/y2-vol-10.jpg",
    toc: [],
    pageCount: 235
  },
  {
    id: "y2-vol-10-25",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 10.25",
    volumeLabel: "Vol 10.25",
    pdfPath: "./Y2/COTE Year 2 Vol 10.25.pdf",
    fileName: "COTE Year 2 Vol 10.25.pdf",
    coverPath: "./assets/covers/y2-vol-10-25.jpg",
    toc: [],
    pageCount: 10
  },
  {
    id: "y2-vol-11",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 11",
    volumeLabel: "Vol 11",
    pdfPath: "./Y2/COTE Year 2 Vol 11.pdf",
    fileName: "COTE Year 2 Vol 11.pdf",
    coverPath: "./assets/covers/y2-vol-11.jpg",
    toc: [],
    pageCount: 223
  },
  {
    id: "y2-vol-12",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 12",
    volumeLabel: "Vol 12",
    pdfPath: "./Y2/COTE Year 2 Vol 12.pdf",
    fileName: "COTE Year 2 Vol 12.pdf",
    coverPath: "./assets/covers/y2-vol-12.jpg",
    toc: [{"title":"Chie Hoshinomiya’s Monologue","page":10,"depth":0},{"title":"Chapter 1: Unusual End-of-Year Special Exam","page":12,"depth":0},{"title":"1","page":20,"depth":1},{"title":"2","page":24,"depth":1},{"title":"Chapter 2: What Should be Finished","page":26,"depth":0},{"title":"1","page":38,"depth":1},{"title":"2","page":41,"depth":1},{"title":"3","page":44,"depth":1},{"title":"4","page":46,"depth":1},{"title":"5","page":49,"depth":1},{"title":"6","page":53,"depth":1},{"title":"7","page":55,"depth":1},{"title":"8","page":58,"depth":1},{"title":"Chapter 3: End-of-Year Special Exam, Opening","page":63,"depth":0},{"title":"1","page":79,"depth":1},{"title":"Chapter 4: Battle of the Vanguards","page":87,"depth":0},{"title":"1","page":89,"depth":1},{"title":"2","page":91,"depth":1},{"title":"3","page":94,"depth":1},{"title":"4","page":99,"depth":1},{"title":"Chapter 5: Katsuragi’s Counterattack","page":101,"depth":0},{"title":"1","page":113,"depth":1},{"title":"Chapter 6: Tears of Regret","page":119,"depth":0},{"title":"1","page":129,"depth":1},{"title":"2","page":132,"depth":1},{"title":"3","page":142,"depth":1},{"title":"4","page":146,"depth":1},{"title":"Chapter 7: Ayanokōji’s Strategy","page":153,"depth":0},{"title":"Chapter 8: The Awaited Opponent","page":172,"depth":0},{"title":"1","page":177,"depth":1},{"title":"2","page":179,"depth":1},{"title":"3","page":184,"depth":1},{"title":"4","page":186,"depth":1},{"title":"5","page":188,"depth":1},{"title":"6","page":193,"depth":1},{"title":"Epilogue: The Truth Is…","page":205,"depth":0},{"title":"1","page":208,"depth":1},{"title":"Author’s Postscript","page":218,"depth":0},{"title":"Ichinose Honami’s Short Story: Approaching Promise","page":219,"depth":0},{"title":"Horikita Suzune’s Short Story: Familiar Everyday Life","page":220,"depth":0},{"title":"Ryūen Kakeru’s Short Story: True Intentions","page":222,"depth":0},{"title":"Sakayanagi Arisu’s Short Story: Wavelength","page":224,"depth":0},{"title":"RoyalMTLs Afterword","page":226,"depth":0},{"title":"Credits","page":227,"depth":0}],
    pageCount: 228
  },
  {
    id: "y2-vol-12-5",
    year: "Y2",
    title: "Classroom of the Elite — Year 2 Vol 12.5",
    volumeLabel: "Vol 12.5",
    pdfPath: "./Y2/COTE Year 2 Vol 12.5.pdf",
    fileName: "COTE Year 2 Vol 12.5.pdf",
    coverPath: "./assets/covers/y2-vol-12-5.jpg",
    toc: [{"title":"Classroom of the Elite – Second Year, Volume 12.5","page":1,"depth":0},{"title":"Illustrations","page":2,"depth":0},{"title":"Prologue: Behind the Scenes","page":8,"depth":0},{"title":"Chapter 1: Checking Each Other’s Answers","page":11,"depth":0},{"title":"1","page":24,"depth":1},{"title":"2","page":26,"depth":1},{"title":"Chapter 2: See You Next Time","page":31,"depth":0},{"title":"Chapter 3: The Vacant Throne","page":43,"depth":0},{"title":"1","page":45,"depth":1},{"title":"Chapter 4: Getting Ahead","page":54,"depth":0},{"title":"1","page":58,"depth":1},{"title":"2","page":63,"depth":1},{"title":"3","page":70,"depth":1},{"title":"Chapter 5: Illusion","page":77,"depth":0},{"title":"1","page":80,"depth":1},{"title":"2","page":85,"depth":1},{"title":"Chapter 6: Even After Graduation","page":93,"depth":0},{"title":"1","page":102,"depth":1},{"title":"Chapter 7: Parent and Child, Child and Parent","page":107,"depth":0},{"title":"1","page":109,"depth":1},{"title":"2","page":114,"depth":1},{"title":"3","page":122,"depth":1},{"title":"4","page":128,"depth":1},{"title":"5","page":137,"depth":1},{"title":"Chapter 8: Celebration","page":139,"depth":0},{"title":"1","page":141,"depth":1},{"title":"2","page":145,"depth":1},{"title":"Chapter 9: The Promised Night","page":148,"depth":0},{"title":"1","page":150,"depth":1},{"title":"2","page":158,"depth":1},{"title":"3","page":161,"depth":1},{"title":"4","page":177,"depth":1},{"title":"Chapter 10: Goals","page":192,"depth":0},{"title":"1","page":195,"depth":1},{"title":"Epilogue: A New Beginning","page":200,"depth":0},{"title":"1","page":203,"depth":1},{"title":"Author’s Postscript","page":204,"depth":0},{"title":"Hiyori Shiina’s Short Story: Friends?","page":205,"depth":0},{"title":"Ichinose Honami’s Short Story: The Other Side of the Promise","page":207,"depth":0},{"title":"Chabashira Sae’s Short Story: Since When…","page":209,"depth":0},{"title":"Yamamura Miki and Morishita Ai’s Short Story: Truly Observing","page":211,"depth":0},{"title":"First-Year Guidebook Short Story: First Contact","page":213,"depth":0}],
    pageCount: 216
  },
  {
    id: "y3-vol-1",
    year: "Y3",
    title: "Classroom of the Elite — Year 3 Vol 1",
    volumeLabel: "Vol 1",
    pdfPath: "./Y3/COTE Year 3 Vol 1.pdf",
    fileName: "COTE Year 3 Vol 1.pdf",
    coverPath: "./assets/covers/y3-vol-1.jpg",
    toc: [{"title":"Cover","page":1,"depth":0},{"title":"Illustrations","page":3,"depth":0},{"title":"Illustration #1","page":3,"depth":1},{"title":"Illustration #2","page":4,"depth":1},{"title":"Illustration #3","page":5,"depth":1},{"title":"Table Of Contents","page":7,"depth":0},{"title":"LegacyEMTLs Fan Translation Notes","page":8,"depth":0},{"title":"Synopsis","page":9,"depth":0},{"title":"Prologue: The End of Everyday Life","page":10,"depth":0},{"title":"Chapter 1: Confusion","page":13,"depth":0},{"title":"Part 1","page":16,"depth":1},{"title":"Chapter 2: Confirmation","page":29,"depth":0},{"title":"Part 1","page":34,"depth":1},{"title":"Chapter 3: The Commencement of a One-Year Period","page":40,"depth":0},{"title":"Part 1","page":45,"depth":1},{"title":"Part 2","page":49,"depth":1},{"title":"Part 3","page":55,"depth":1},{"title":"Part 4","page":66,"depth":1},{"title":"Part 5","page":69,"depth":1},{"title":"Chapter 4: An Onlooker's Perspective","page":75,"depth":0},{"title":"Part 1","page":85,"depth":1},{"title":"Part 2","page":90,"depth":1},{"title":"Chapter 5: Convolution","page":98,"depth":0},{"title":"Part 1","page":108,"depth":1},{"title":"Part 2","page":112,"depth":1},{"title":"Part 3","page":126,"depth":1},{"title":"Part 4","page":133,"depth":1},{"title":"Part 5","page":136,"depth":1},{"title":"Chapter 6: School Life in Class C","page":146,"depth":0},{"title":"Part 1","page":155,"depth":1},{"title":"Chapter 7: Ayanokouji's Defeat","page":163,"depth":0},{"title":"Part 1","page":174,"depth":1},{"title":"Part 2","page":180,"depth":1},{"title":"Part 3","page":184,"depth":1},{"title":"Part 4","page":189,"depth":1},{"title":"Part 5","page":199,"depth":1},{"title":"Chapter 8: Enemies and Allies","page":203,"depth":0},{"title":"Part 1","page":216,"depth":1},{"title":"Epilogue: What Awaits Ahead","page":225,"depth":0},{"title":"Part 1","page":229,"depth":1},{"title":"Part 2","page":237,"depth":1},{"title":"Author's Afterword","page":248,"depth":0},{"title":"Y2V12.75 - Ibuki Mio Short Story: Behind the Scenes","page":249,"depth":0},{"title":"Part 1","page":256,"depth":1},{"title":"Shiraishi Asuka’s Short Story: The Secrets She Harbors","page":258,"depth":0},{"title":"Morishita Ai’s Short Story: Gatling Gun","page":261,"depth":0},{"title":"Shiraishi Asuka's Short Story: An Extra Pair of Ears","page":263,"depth":0},{"title":"Ibuki Mio's Short Story: Concern?","page":265,"depth":0},{"title":"Guidebook Short Story: A Pillar of Support","page":267,"depth":0},{"title":"Guidebook Short Story: Mock Date","page":271,"depth":0},{"title":"Guidebook Short Story: Ever Since That Time...","page":275,"depth":0},{"title":"LegacyEMTLs Afterword","page":284,"depth":0},{"title":"LegacyEMTLs Credits","page":286,"depth":0}],
    pageCount: 287
  },
  {
    id: "y3-vol-2",
    year: "Y3",
    title: "Classroom of the Elite — Year 3 Vol 2",
    volumeLabel: "Vol 2",
    pdfPath: "./Y3/COTE Year 3 Vol 2.pdf",
    fileName: "COTE Year 3 Vol 2.pdf",
    coverPath: "./assets/covers/y3-vol-2.jpg",
    toc: [{"title":"Cover","page":1,"depth":0},{"title":"Illustrations","page":3,"depth":0},{"title":"Illustration #1","page":3,"depth":1},{"title":"Table Of Contents","page":7,"depth":0},{"title":"LegacyEMTLs Fan Translation Notes","page":8,"depth":0},{"title":"Synopsis","page":9,"depth":0},{"title":"Prologue: Nanase Tsubasa's Monologue","page":10,"depth":0},{"title":"Chapter 1: Fitting In","page":13,"depth":0},{"title":"Part 1","page":17,"depth":1},{"title":"Part 2","page":27,"depth":1},{"title":"Part 3","page":34,"depth":1},{"title":"Chapter 2: A Gentle Exam","page":43,"depth":0},{"title":"Part 1","page":52,"depth":1},{"title":"Part 2","page":55,"depth":1},{"title":"Chapter 3: Getting to Know the Opponent","page":66,"depth":0},{"title":"Part 1","page":69,"depth":1},{"title":"Part 2","page":75,"depth":1},{"title":"Part 3","page":85,"depth":1},{"title":"Part 4","page":89,"depth":1},{"title":"Part 5","page":94,"depth":1},{"title":"Part 6","page":98,"depth":1},{"title":"Part 7","page":111,"depth":1},{"title":"Part 8","page":115,"depth":1},{"title":"Part 9","page":120,"depth":1},{"title":"Chapter 4: The Quest for Knowledge","page":126,"depth":0},{"title":"Part 1","page":131,"depth":1},{"title":"Part 2","page":134,"depth":1},{"title":"Part 3","page":141,"depth":1},{"title":"Part 4","page":146,"depth":1},{"title":"Chapter 5: Yamamura's Courage","page":152,"depth":0},{"title":"Part 1","page":154,"depth":1},{"title":"Part 2","page":156,"depth":1},{"title":"Part 3","page":164,"depth":1},{"title":"Part 4","page":168,"depth":1},{"title":"Part 5","page":175,"depth":1},{"title":"Chapter 6: Fortune and Misfortune Are Intertwined","page":182,"depth":0},{"title":"Part 1","page":190,"depth":1},{"title":"Part 2","page":195,"depth":1},{"title":"Part 3","page":206,"depth":1},{"title":"Chapter 7: The Observer","page":211,"depth":0},{"title":"Part 1","page":213,"depth":1},{"title":"Part 2","page":220,"depth":1},{"title":"Part 3","page":226,"depth":1},{"title":"Epilogue: Another Story Begins","page":231,"depth":0},{"title":"Part 1","page":235,"depth":1},{"title":"Part 2","page":238,"depth":1},{"title":"Author's Afterword","page":248,"depth":0},{"title":"Ichinose Honami’s Short Story: To Love Too Much…","page":249,"depth":0},{"title":"Morishita Ai’s Short Story: Ear Gun","page":251,"depth":0},{"title":"Shiina Hiyori’s Short Story: A Wavering Heart","page":253,"depth":0},{"title":"Shiraishi Asuka’s Short Story: The Voice Hidden Within","page":255,"depth":0},{"title":"Special Short Story: The Six First-Year Students","page":257,"depth":0},{"title":"LegacyEMTLs Afterword","page":261,"depth":0},{"title":"LegacyEMTLs Credits","page":262,"depth":0}],
    pageCount: 263
  },
  {
    id: "y3-vol-3",
    year: "Y3",
    title: "Classroom of the Elite — Year 3 Vol 3",
    volumeLabel: "Vol 3",
    pdfPath: "./Y3/COTE Year 3 Vol 3.pdf",
    fileName: "COTE Year 3 Vol 3.pdf",
    coverPath: "./assets/covers/y3-vol-3.jpg",
    toc: [{"title":"Cover","page":1,"depth":0},{"title":"Illustrations","page":3,"depth":0},{"title":"Illustration #1","page":3,"depth":1},{"title":"Illustration #2","page":4,"depth":1},{"title":"Illustration #3","page":5,"depth":1},{"title":"Table Of Contents","page":9,"depth":0},{"title":"LegacyEMTLs Fan Translation Notes","page":10,"depth":0},{"title":"Synopsis","page":11,"depth":0},{"title":"Prologue: Shiina Hiyori's Monologue","page":12,"depth":0},{"title":"Chapter 1: Opening. Survival Game Special Exam.","page":14,"depth":0},{"title":"Part 1","page":17,"depth":1},{"title":"Part 2","page":30,"depth":1},{"title":"Part 3","page":40,"depth":1},{"title":"Chapter 2: A Surprise Attack","page":46,"depth":0},{"title":"Part 1","page":57,"depth":1},{"title":"Part 2","page":72,"depth":1},{"title":"Part 3","page":80,"depth":1},{"title":"Part 4","page":84,"depth":1},{"title":"Chapter 3: The Unseen Pressure","page":86,"depth":0},{"title":"Part 1","page":91,"depth":1},{"title":"Part 2","page":95,"depth":1},{"title":"Part 3","page":100,"depth":1},{"title":"Part 4","page":108,"depth":1},{"title":"Part 5","page":112,"depth":1},{"title":"Chapter 4: A Chance Encounter","page":119,"depth":0},{"title":"Part 1","page":123,"depth":1},{"title":"Part 2","page":126,"depth":1},{"title":"Part 3","page":128,"depth":1},{"title":"Part 4","page":135,"depth":1},{"title":"Part 5","page":147,"depth":1},{"title":"Chapter 5: The Alliance","page":151,"depth":0},{"title":"Part 1","page":155,"depth":1},{"title":"Part 2","page":158,"depth":1},{"title":"Part 3","page":160,"depth":1},{"title":"Part 4","page":162,"depth":1},{"title":"Chapter 6: The Real Goal","page":167,"depth":0},{"title":"Part 1","page":171,"depth":1},{"title":"Part 2","page":174,"depth":1},{"title":"Part 3","page":178,"depth":1},{"title":"Part 4","page":180,"depth":1},{"title":"Part 5","page":182,"depth":1},{"title":"Part 6","page":185,"depth":1},{"title":"Chapter 7: The Time of the Decisive Battle","page":197,"depth":0},{"title":"Part 1","page":204,"depth":1},{"title":"Part 2","page":207,"depth":1},{"title":"Part 3","page":210,"depth":1},{"title":"Part 4","page":221,"depth":1},{"title":"Part 5","page":230,"depth":1},{"title":"Epilogue: Show Me What You’ve Got","page":233,"depth":0},{"title":"Part 1","page":236,"depth":1},{"title":"Author's Afterword","page":253,"depth":0},{"title":"LegacyEMTLs Afterword","page":255,"depth":0},{"title":"LegacyEMTLs Credits","page":256,"depth":0}],
    pageCount: 256
  },
  {
    id: "y3-vol-3-ss",
    year: "Y3",
    title: "Classroom of the Elite — Year 3 Vol 3 SS",
    volumeLabel: "Vol 3 SS",
    pdfPath: "./Y3/COTE Year 3 Vol 3 SS.pdf",
    fileName: "COTE Year 3 Vol 3 SS.pdf",
    coverPath: "./assets/covers/y3-vol-3-ss.jpg",
    toc: [{"title":"Horikita Suzune’s Short Story:","page":1,"depth":0},{"title":"Contradiction?","page":1,"depth":0},{"title":"Morishita Ai’s Short Story:","page":3,"depth":0},{"title":"Honour","page":3,"depth":0},{"title":"Shiraishi Asuka’s Short Story:","page":5,"depth":0},{"title":"Colourless and Transparent","page":5,"depth":0},{"title":"Shiina Hiyori’s Short Story:","page":8,"depth":0},{"title":"Distancing","page":8,"depth":0}],
    pageCount: 9
  },
  {
    id: "y3-vol-4",
    year: "Y3",
    title: "Classroom of the Elite — Year 3 Vol 4",
    volumeLabel: "Vol 4",
    pdfPath: "./Y3/COTE Year 3 Vol 4.pdf",
    fileName: "COTE Year 3 Vol 4.pdf",
    coverPath: "./assets/covers/y3-vol-4.jpg",
    toc: [{"title":"Image Gallery","page":2,"depth":0},{"title":"A Note to Readers","page":7,"depth":0},{"title":"Editor’s Foreword","page":8,"depth":0},{"title":"Table of Contents","page":11,"depth":0},{"title":"Prologue: Ibuki Mio's Monologue","page":12,"depth":0},{"title":"Chapter 1: Token Collection Special Exam","page":14,"depth":0},{"title":"Part 1","page":39,"depth":1},{"title":"Part 2","page":53,"depth":1},{"title":"Part 3","page":63,"depth":1},{"title":"Chapter 2: From a Subtle Rift","page":69,"depth":0},{"title":"Part 1","page":85,"depth":1},{"title":"Part 2","page":116,"depth":1},{"title":"Part 3","page":121,"depth":1},{"title":"Part 4","page":126,"depth":1},{"title":"Part 5","page":148,"depth":1},{"title":"Chapter 3: The Approaching Tasks","page":156,"depth":0},{"title":"Part 1","page":163,"depth":1},{"title":"Part 2","page":169,"depth":1},{"title":"Part 3","page":174,"depth":1},{"title":"Chapter 4: Nanase and Amasawa's Private Pool Time","page":185,"depth":0},{"title":"Chapter 5: The Candidates","page":208,"depth":0},{"title":"Part 1","page":216,"depth":1},{"title":"Part 2","page":222,"depth":1},{"title":"Part 3","page":229,"depth":1},{"title":"Part 4","page":243,"depth":1},{"title":"Chapter 6: I'll Do Anything You Want","page":247,"depth":0},{"title":"Part 1","page":251,"depth":1},{"title":"Part 2","page":253,"depth":1},{"title":"Part 3","page":258,"depth":1},{"title":"Part 4","page":272,"depth":1},{"title":"Part 5","page":277,"depth":1},{"title":"Chapter 7: Intertwining Strategies","page":283,"depth":0},{"title":"Part 1","page":292,"depth":1},{"title":"Part 2","page":295,"depth":1},{"title":"Part 3","page":303,"depth":1},{"title":"Part 4","page":308,"depth":1},{"title":"Chapter 8: A Glimpse of Thought","page":314,"depth":0},{"title":"Part 1","page":319,"depth":1},{"title":"Part 2","page":323,"depth":1},{"title":"Part 3","page":326,"depth":1},{"title":"Epilogue: A Special Existence","page":348,"depth":0},{"title":"Part 1","page":352,"depth":1},{"title":"Part 2","page":356,"depth":1},{"title":"Part 3","page":367,"depth":1},{"title":"Part 4","page":370,"depth":1},{"title":"Part 5","page":380,"depth":1},{"title":"Ichinose SS: Linked Thoughts","page":384,"depth":0},{"title":"Kushida SS: Suspicious, But...","page":386,"depth":0},{"title":"Ichika & Nanase SS: Nanase's Love Life","page":390,"depth":0},{"title":"Kōenji & Mii chan SS: Invisible Thread","page":393,"depth":0},{"title":"Author's Afterword","page":397,"depth":0},{"title":"Image Gallery 2","page":399,"depth":0},{"title":"Translation Team's Afterword","page":402,"depth":0},{"title":"Credits","page":404,"depth":0}],
    pageCount: 404
  },
  {
    id: "vol-0",
    year: "SPECIAL",
    title: "Classroom of the Elite — Volume 0",
    volumeLabel: "Vol 0",
    pdfPath: "./COTE Vol 0.pdf",
    fileName: "COTE Vol 0.pdf",
    coverPath: "./assets/covers/cote-vol-0.jpg",
    toc: [],
    pageCount: 223
  }
];

const yearInfo = {
  Y1: { label: "Year 1", description: "The beginning of life at Advanced Nurturing High School.", short: "YEAR 01", coverClass: "cover-year1", mark: "01" },
  Y2: { label: "Year 2", description: "A new year, new tests, and shifting alliances.", short: "YEAR 02", coverClass: "cover-year2", mark: "02" },
  Y3: { label: "Year 3", description: "Continue the collection with the volumes in your archive.", short: "YEAR 03", coverClass: "cover-year3", mark: "03" },
  SPECIAL: { label: "Volume 0", description: "A separate special volume entry.", short: "SPECIAL VOLUME", coverClass: "cover-special", mark: "0" }
};

function findVolume(id) {
  return volumes.find(volume => volume.id === id) || null;
}

function isConfigured(volume) {
  return Boolean(volume && typeof volume.pdfPath === "string" && volume.pdfPath.trim() && volume.fileName && volume.fileName.trim());
}

/** Resolve relative paths safely, encoding literal spaces once without double-encoding existing escapes. */
function resolveProjectPath(path) {
  if (!path || typeof path !== "string") return "";
  try { return new URL(path, document.baseURI).href; }
  catch { return ""; }
}

function volumePageLabel(volume) {
  return volume.year === "SPECIAL" ? "SPECIAL COLLECTION" : `${yearInfo[volume.year]?.label || volume.year} · ${volume.volumeLabel}`;
}

window.CoteVolumes = { volumes, yearInfo, findVolume, isConfigured, resolveProjectPath, volumePageLabel };
})();
