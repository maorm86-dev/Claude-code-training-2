/* רמה 3 — הרחבה והתאמה (m12–m16) */
COURSE.modules.push(
{
 id:'m12',level:3,order:1,icon:'🧰',title:'Skills: הוראות לפי דרישה',minutes:15,verified:'2026-10-19',
 summary:'Skill הוא תיקייה עם קובץ SKILL.md שמלמד את Claude משימה או נוהל. הוא נטען רק כשצריך, ולכן אפשר להחזיק הרבה ידע בלי לעמוס על ההקשר.',
 goals:['ליצור Skill פשוט','להבין מתי להפעיל אותו אוטומטית ומתי רק ידנית','לדעת להבדיל בין Skill ל־CLAUDE.md'],
 predict:{q:'יש לכם נוהל של 40 שורות לסקירת קוד שנחוץ רק לפעמים. איפה תשימו אותו כדי שלא יעמיס על כל שיחה?',a:'ב־Skill. גוף ה־Skill נטען רק בשימוש, בעוד CLAUDE.md נטען בכל שיחה.'},
 docs:[['skills','Skills']],
 blocks:[
  {t:'h',x:'מה זה ואיפה זה יושב'},
  {t:'table',head:['היקף','מיקום'],rows:[
   ['אישי (כל הפרויקטים)','`~/.claude/skills/<name>/SKILL.md`'],
   ['פרויקט (משותף בגיט)','`.claude/skills/<name>/SKILL.md`'],
   ['Plugin','`<plugin>/skills/<name>/SKILL.md`, מופעל כ־`/plugin:name`']]},
  {t:'p',x:'במקרה של התנגשות שמות: ארגוני גובר על אישי, ואישי על פרויקט.'},
  {t:'h',x:'Skill ראשון'},
  {t:'code',x:'---\nname: explain-code\ndescription: Explains code with an analogy and a diagram. Use when asked how something works.\n---\n\nWhen explaining code:\n1. Start with an everyday analogy\n2. Draw an ASCII diagram of the flow\n3. Walk through the code step by step\n4. Name one common gotcha'},
  {t:'p',x:'מפעילים בשתי דרכים: **ידנית** עם `/explain-code`, או **אוטומטית** כש־Claude מזהה שהבקשה מתאימה לתיאור. לכן **התיאור הוא החלק החשוב ביותר**: שימו בו קודם את מקרה השימוש.'},
  {t:'h',x:'שדות שימושיים ב־frontmatter'},
  {t:'table',head:['שדה','משמעות'],rows:[
   ['`description`','מתי להשתמש. מקוצץ ב־1,536 תווים ברשימה'],
   ['`disable-model-invocation: true`','רק אתם יכולים להפעיל. לפעולות עם תופעות לוואי כמו deploy או commit'],
   ['`user-invocable: false`','רק Claude יכול להפעיל'],
   ['`allowed-tools`','כלים שמאושרים מראש בזמן ה־Skill'],
   ['`context: fork`','מריץ את ה־Skill בסוכן־משנה'],
   ['`argument-hint` / `$ARGUMENTS`','העברת ארגומנטים בפקודה']]},
  {t:'h',x:'עוד נקודות'},
  {t:'list',x:['**הקשר חי:** בגוף ה־Skill אפשר להריץ פקודה לפני שהוא נטען, לדוגמה להזריק את הפלט של `git diff HEAD`.','**קבצים תומכים:** שימו בתיקייה מסמכים או סקריפטים וקשרו אליהם מה־SKILL.md. הם נטענים רק כשצריך.','**אורך:** שמרו את SKILL.md מתחת ל־500 שורות.','**אחרי שינוי:** `/reload-skills` טוען skills שנוספו במהלך הסשן.','**בריאות:** `/skill-doctor` מראה אילו skills עולים בהקשר ולא בשימוש.']},
  {t:'callout',k:'tip',x:'כלל הבחירה: הוראה שנחוצה **תמיד** — CLAUDE.md. נוהל שנחוץ **לפעמים** — Skill. פעולה שחייבת **לקרות בוודאות** — Hook.'},
  {t:'callout',k:'note',x:'ב־Claude Code יש skills מובנים כמו `/loop`, `/batch`, `/debug`, `/doctor`. כולם עובדים באותה צורה.'}
 ],
 recap:['Skill = תיקייה + SKILL.md; נטען לפי דרישה.','התיאור קובע מתי Claude יפעיל אותו; `disable-model-invocation` לפעולות רגישות.','תמיד → CLAUDE.md; לפעמים → Skill; בוודאות → Hook.'],
 quiz:[
  {q:'איפה שומרים Skill שיהיה זמין בכל הפרויקטים שלכם?',o:['`.claude/skills/` בפרויקט','`~/.claude/skills/<name>/SKILL.md`','`/etc/skills`','`CLAUDE.md`'],a:1,w:'התיקייה האישית ב־`~/.claude/skills/` זמינה בכל הפרויקטים.'},
  {q:'איך מונעים מ־Claude להפעיל Skill של deploy בעצמו?',o:['`disable-model-invocation: true`','למחוק את התיאור','לשים אותו ב־.gitignore','להוסיף סימן קריאה'],a:0,w:'כך רק אתם מפעילים אותו ידנית עם `/name`.'},
  {q:'מה החלק הכי חשוב ב־Skill בהקשר של הפעלה אוטומטית?',o:['שם התיקייה','ה־description','גודל הקובץ','סדר השורות'],a:1,w:'Claude מחליט לפי התיאור מתי לטעון את ה־Skill.'}
 ]
},
{
 id:'m13',level:3,order:2,icon:'🤖',title:'סוכני־משנה (Subagents)',minutes:15,verified:'2026-10-19',
 summary:'סוכן־משנה הוא עוזר עם חלון הקשר נפרד, הנחיות משלו והרשאות משלו. הוא עושה את העבודה הרועשת ומחזיר רק סיכום.',
 goals:['להבין למה סוכן־משנה שומר על ההקשר נקי','ליצור סוכן מותאם ולהפעיל אותו','להכיר את הסוכנים המובנים'],
 predict:{q:'אתם רוצים סקירת קוד יסודית אבל לא רוצים ש־200 קבצים ימלאו את השיחה שלכם. איך הייתם מארגנים את זה?',a:'מאציל את הסקירה לסוכן־משנה: הוא קורא את הקבצים בחלון משלו וחוזר רק עם ממצאים.'},
 docs:[['sub-agents','סוכני־משנה'],['agent-teams','צוותי סוכנים']],
 blocks:[
  {t:'h',x:'מה מקבלים'},
  {t:'list',x:['**חלון הקשר נפרד** — פלט מילולי נשאר שם, רק סיכום חוזר','**הוראות וכלים משלו** — אפשר להגביל לקריאה בלבד','**מודל משלו** — למשל haiku למשימות פשוטות וזולות']},
  {t:'h',x:'סוכנים מובנים'},
  {t:'table',head:['סוכן','תפקיד'],rows:[
   ['Explore','חיפוש מהיר בקוד, קריאה בלבד'],
   ['Plan','מחקר קריאה בלבד שמשמש מצב תוכנית'],
   ['general-purpose','משימות רב־שלביות שדורשות גם חקירה וגם פעולה']]},
  {t:'h',x:'להגדיר סוכן משלכם'},
  {t:'p',x:'קובץ Markdown עם frontmatter. רק `name` ו־`description` חובה. מיקומים: `.claude/agents/` (פרויקט) או `~/.claude/agents/` (אישי).'},
  {t:'code',x:'---\nname: code-reviewer\ndescription: Reviews code for quality and security. Use proactively after code changes.\ntools: Read, Glob, Grep\nmodel: sonnet\n---\n\nYou are a senior code reviewer. Review the recent changes and report issues\nordered by severity, each with file:line and a suggested fix.'},
  {t:'p',x:'שדות נוספים: `disallowedTools`, `permissionMode`, `skills`, `mcpServers`, `hooks`, `memory`, `maxTurns`, `isolation: worktree`, `background`.'},
  {t:'callout',k:'note',x:'בגרסאות עדכניות `/agents` רק מדפיסה תזכורת: מבקשים מ־Claude ליצור סוכן, או עורכים את הקבצים ישירות. בגרסאות עד 2.1.197 היא פותחת אשף אינטראקטיבי. Claude מזהה קבצים חדשים תוך שניות; תיקיית `agents` חדשה דורשת הפעלה מחדש.'},
  {t:'h',x:'להפעיל סוכן'},
  {t:'table',head:['דרך','דוגמה'],rows:[
   ['אוטומטי','Claude מאציל לפי ה־description'],
   ['בשפה טבעית','«use the code-reviewer subagent to check my changes»'],
   ['@-אזכור (מבטיח)','`@"code-reviewer (agent)"`'],
   ['לכל הסשן','`claude --agent code-reviewer`']]},
  {t:'h',x:'גבולות ועלות'},
  {t:'list',x:['סוכן יכול ליצור סוכנים בעצמו: עד שלוש שכבות כברירת מחדל (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`).','עד 20 סוכנים במקביל כברירת מחדל (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`).','סוכן **לא** יורש את השיחה שלכם — בקשת ההאצלה חייבת לכלול את ההקשר.','כל סוכן צורך טוקנים משלו. השתמשו במודל קטן יותר למשימות פשוטות.']},
  {t:'callout',k:'tip',x:'**צוותי סוכנים** (agent teams) הם נסיוניים (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) ויכולים לעלות בערך פי 7 בטוקנים. התחילו עם סוכני־משנה רגילים.'}
 ],
 recap:['סוכן־משנה = הקשר נפרד, כלים והנחיות משלו, חוזר עם סיכום.','קובץ ב־`.claude/agents/` עם `name` ו־`description`.','`@"name (agent)"` מבטיח הפעלה; `claude --agent name` לכל הסשן.'],
 quiz:[
  {q:'מה היתרון המרכזי של סוכן־משנה?',o:['הוא מהיר יותר תמיד','הוא שומר את הפלט הרועש מחוץ להקשר הראשי','הוא חינם','הוא לא צריך הרשאות'],a:1,w:'חלון ההקשר נפרד, ורק סיכום חוזר.'},
  {q:'איזה שדות חובה בקובץ של סוכן?',o:['`tools` ו־`model`','`name` ו־`description`','`hooks`','`isolation`'],a:1,w:'רק `name` ו־`description` נדרשים; השאר אופציונליים.'},
  {q:'איך מבטיחים שסוכן מסוים יופעל?',o:['לקוות','@-אזכור כמו `@"code-reviewer (agent)"`','לכתוב באותיות גדולות','`/clear`'],a:1,w:'@-אזכור מבטיח שהסוכן יריץ את המשימה.'}
 ]
},
{
 id:'m14',level:3,order:3,icon:'🪝',title:'Hooks: אוטומציה שמובטחת',minutes:16,verified:'2026-10-19',
 summary:'Hooks הם פקודות שרצות אוטומטית באירועים בחיי הסשן, כמו לפני או אחרי שימוש בכלי. בניגוד להנחיות ב־CLAUDE.md, הן קורות בוודאות.',
 goals:['להבין את מבנה ההגדרה: אירוע, matcher, פקודה','לכתוב hook שמריץ פורמטר אחרי עריכה','לדעת איך hook חוסם פעולה'],
 predict:{q:'איך תבטיחו ש־Prettier ירוץ אחרי כל עריכת קובץ, בלי להסתמך על כך ש־Claude «יזכור»?',a:'hook על האירוע PostToolUse עם matcher של Edit ו־Write שמריץ את הפורמטר. הוא רץ תמיד, לא לפי שיקול דעת.'},
 docs:[['hooks-guide','מדריך ל־hooks'],['hooks','הפניה מלאה']],
 blocks:[
  {t:'h',x:'הרעיון'},
  {t:'p',x:'CLAUDE.md הוא בקשה. Hook הוא **קוד** שרץ בנקודה קבועה בלי תלות בשיקול דעת המודל. משתמשים בו לפורמט אוטומטי, חסימת פעולות, התראות, הזרקת הקשר ולוגים.'},
  {t:'h',x:'אירועים נפוצים'},
  {t:'table',head:['אירוע','מתי הוא רץ'],rows:[
   ['`PreToolUse`','לפני שימוש בכלי. אפשר לחסום, לאשר או לשנות את הקלט'],
   ['`PostToolUse`','אחרי שכלי הסתיים'],
   ['`UserPromptSubmit`','כששולחים בקשה'],
   ['`Notification`','כש־Claude צריך את תשומת לבכם'],
   ['`Stop`','כש־Claude מסיים תגובה'],
   ['`SessionStart` / `SessionEnd`','תחילת וסוף סשן'],
   ['`PermissionRequest`','בקשת הרשאה']]},
  {t:'h',x:'דוגמה: פורמט אוטומטי אחרי עריכה'},
  {t:'p',x:'ב־`.claude/settings.json` (או `~/.claude/settings.json`):'},
  {t:'code',x:'{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Edit|Write",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "jq -r \'.tool_input.file_path\' | xargs npx prettier --write"\n          }\n        ]\n      }\n    ]\n  }\n}'},
  {t:'p',x:'ה־hook מקבל על stdin אובייקט JSON עם פרטי הקריאה (למשל `tool_input.file_path`), ו־`jq` שולף ממנו את הנתיב.'},
  {t:'h',x:'לחסום פעולה'},
  {t:'p',x:'ב־`PreToolUse`, סקריפט שמסתיים בקוד יציאה **2** חוסם את הכלי, וההודעה שהוא כותב ל־stderr מועברת ל־Claude כדי שיתקן. אפשר גם להחזיר JSON עם `permissionDecision` (allow, deny, ask) או לשכתב את הקלט עם `updatedInput`.'},
  {t:'code',x:'#!/bin/bash\ninput=$(cat)\ncmd=$(echo "$input" | jq -r \'.tool_input.command\')\nif echo "$cmd" | grep -q \'rm -rf\'; then\n  echo "Blocked: rm -rf is not allowed" >&2\n  exit 2\nfi\nexit 0'},
  {t:'h',x:'סוגי hooks ועוד'},
  {t:'list',x:['**command** — פקודת shell (הנפוץ ביותר).','**prompt** — מודל קטן שמחליט (כך בנוי `/goal`).','`/hooks` מציג את ההגדרות; `claude --debug-file ./log.txt` מראה מה רץ.','אפשר לחסוך הקשר: hook שמסנן פלט בדיקות ומחזיר רק כשלונות.']},
  {t:'callout',k:'warn',x:'hooks רצים עם ההרשאות שלכם. אל תתקינו hooks מגורם שאינכם סומכים עליו, ובדקו כל hook שמגיע ב־plugin או בפרויקט שהורדתם.'}
 ],
 recap:['Hook = קוד שרץ באירוע; מובטח, בניגוד ל־CLAUDE.md.','מבנה: אירוע → matcher → רשימת hooks (`type: command`).','קוד יציאה 2 ב־PreToolUse חוסם; `/hooks` מציג.'],
 quiz:[
  {q:'מה ההבדל המרכזי בין hook להוראה ב־CLAUDE.md?',o:['Hook הוא קוד שרץ בוודאות; CLAUDE.md הוא הנחיה','אין הבדל','Hook איטי יותר','CLAUDE.md אוכף'],a:0,w:'Hooks דטרמיניסטיים, בעוד CLAUDE.md מנחה את המודל.'},
  {q:'איזה אירוע מתאים להרצת פורמטר אחרי כל עריכת קובץ?',o:['`SessionStart`','`Notification`','`PostToolUse` עם matcher של Edit ו־Write','`Stop`'],a:2,w:'`PostToolUse` רץ אחרי שהכלי הסתיים, ו־matcher מצמצם לעריכות.'},
  {q:'מה קוד היציאה שחוסם כלי ב־PreToolUse?',o:['0','1','2','255'],a:2,w:'קוד 2 חוסם ומעביר את הודעת ה־stderr ל־Claude.'}
 ]
},
{
 id:'m15',level:3,order:4,icon:'🔌',title:'MCP: חיבור לכלים חיצוניים',minutes:15,verified:'2026-10-19',
 summary:'MCP הוא תקן פתוח שמחבר את Claude Code למערכות חיצוניות: מסדי נתונים, כלי ניהול משימות, ניטור. כך הוא קורא ופועל שם במקום שתעתיקו נתונים ידנית.',
 goals:['להוסיף שרת MCP מרוחק ושרת מקומי','להבין את שלושת ההיקפים','להכיר את סיכוני האבטחה ואת העלות בהקשר'],
 predict:{q:'באילו מצבים הייתם מחברים שרת MCP, ובאילו מצבים כלי שורת פקודה כמו gh יספיק?',a:'MCP שווה כשאתם מדביקים נתונים ממערכת אחרת שוב ושוב. אם יש CLI מוכר (gh, aws, gcloud), הוא לרוב חסכוני יותר בהקשר כי אינו מוסיף רשימת כלים.'},
 docs:[['mcp','MCP'],['mcp-quickstart','התחלה מהירה ל־MCP']],
 blocks:[
  {t:'h',x:'להוסיף שרת'},
  {t:'code',x:'# שרת מרוחק (HTTP, מומלץ)\nclaude mcp add --transport http notion https://mcp.notion.com/mcp\n\n# עם כותרת הרשאה\nclaude mcp add --transport http secure-api https://api.example.com/mcp \\\n  --header "Authorization: Bearer your-token"\n\n# שרת מקומי (stdio). ה־-- מפריד בין האפשרויות של Claude לפקודת השרת\nclaude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \\\n  -- npx -y airtable-mcp-server'},
  {t:'callout',k:'note',x:'תעבורת SSE מסומנת כמיושנת; העדיפו HTTP כשזמין.'},
  {t:'h',x:'ניהול'},
  {t:'code',x:'claude mcp list           # שרתים ומצב\nclaude mcp get notion     # פרטים\nclaude mcp remove notion  # הסרה\n# בתוך סשן:\n/mcp                      # סטטוס, התחברות (OAuth), חיבור מחדש, הפעלה/כיבוי'},
  {t:'p',x:'שרתים מרוחקים משתמשים לרוב ב־OAuth: מריצים `/mcp` ועוקבים אחרי ההתחברות בדפדפן, או `claude mcp login <name>` מהטרמינל.'},
  {t:'h',x:'היקפים (scopes)'},
  {t:'table',head:['היקף','דגל','נשמר ב־','מי רואה'],rows:[
   ['מקומי (ברירת מחדל)','`-s local`','`~/.claude.json`','אתם, בפרויקט הנוכחי'],
   ['פרויקט','`-s project`','`.mcp.json` בשורש','הצוות דרך הגיט'],
   ['משתמש','`-s user`','`~/.claude.json`','אתם, בכל הפרויקטים']]},
  {t:'p',x:'כשיש הגדרות באותו שם בכמה היקפים, מקומי גובר על פרויקט, ופרויקט על משתמש. שרתים מ־`.mcp.json` דורשים אישור בסשן אינטראקטיבי.'},
  {t:'h',x:'להשתמש'},
  {t:'code',x:'show me the data from @github:repos/owner/repo/issues\nsummarize the latest comments on the Q4 planning page'},
  {t:'h',x:'עלות ואבטחה'},
  {t:'list',x:['**הקשר:** הגדרות הכלים נטענות בהשהיה כברירת מחדל (tool search), ובכל זאת השבתת שרתים שלא בשימוש (`/mcp`) חוסכת.','**פלט ענק:** `MAX_MCP_OUTPUT_TOKENS` (ברירת מחדל 25,000) מגביל תוצאות.','**אבטחה:** התחברו רק לשרתים שאתם סומכים עליהם. שרת שמחזיר תוכן חיצוני פותח פתח ל־prompt injection.']}
 ],
 recap:['`claude mcp add --transport http|stdio` מוסיף; `/mcp` מנהל ומתחבר.','היקפים: local, project (`.mcp.json`), user.','סומכים רק על שרתים מוכרים; מכבים מה שלא בשימוש; CLI לעיתים עדיף.'],
 quiz:[
  {q:'איפה נשמר שרת MCP בהיקף project?',o:['`~/.claude.json`','`.mcp.json` בשורש הפרויקט','`CLAUDE.md`','`settings.local.json`'],a:1,w:'`.mcp.json` נכנס לגיט ומשותף לצוות.'},
  {q:'מה עושה `--` בפקודת הוספת שרת stdio?',o:['מוחק את השרת','מפריד בין האפשרויות של Claude לפקודת השרת','מכבה את OAuth','מגדיר היקף'],a:1,w:'כל מה שאחרי `--` נשלח לשרת, כך שדגלים כמו `--port` לא ינותחו על ידי Claude.'},
  {q:'מהו הסיכון העיקרי בחיבור שרת MCP לא מוכר?',o:['הוא מאט את המחשב','prompt injection וגישה לנתונים דרך תוכן חיצוני','הוא מוחק את CLAUDE.md','אין סיכון'],a:1,w:'שרת שמביא תוכן חיצוני יכול להכניס הוראות זדוניות להקשר.'}
 ]
},
{
 id:'m16',level:3,order:5,icon:'⚙️',title:'settings.json, כללי הרשאות וסנדבוקס',minutes:15,verified:'2026-10-19',
 summary:'מגדירים התנהגות של Claude Code בקבצי settings בשכבות. כללי allow, ask ו־deny קובעים בדיוק מה מותר, והסנדבוקס מוסיף בידוד ברמת מערכת ההפעלה.',
 goals:['לדעת איזו שכבת הגדרות גוברת','לכתוב כללי הרשאות עם תחביר Tool(specifier)','לדעת מה עושה `/sandbox`'],
 predict:{q:'יש לכם הגדרה אישית ב־~/.claude/settings.json והגדרה שונה לאותו מפתח ב־.claude/settings.json של הפרויקט. איזו תנצח ולמה?',a:'של הפרויקט (ה־shared project) גוברת על המשתמש. הסדר מהגבוה לנמוך: מנוהל, שורת פקודה, local, project, user.'},
 docs:[['settings','קבצי הגדרות וקדימויות'],['permissions','הרשאות'],['sandboxing','סנדבוקס']],
 blocks:[
  {t:'h',x:'שכבות ההגדרות (מהגבוהה לנמוכה)'},
  {t:'table',head:['שכבה','קובץ','מי'],rows:[
   ['מנוהל','`managed-settings.json` / MDM / קונסולה','הארגון'],
   ['שורת פקודה','`claude --settings`','הסשן הזה'],
   ['מקומי לפרויקט','`.claude/settings.local.json`','אתם, בפרויקט (לא בגיט)'],
   ['משותף לפרויקט','`.claude/settings.json`','כל הצוות'],
   ['משתמש','`~/.claude/settings.json`','אתם, בכל מקום']]},
  {t:'p',x:'מפתח שהוגדר בשכבה גבוהה דורס את אותו מפתח בשכבה נמוכה. `/config` פותח ממשק, ו־`/permissions` מנהל כללי הרשאות.'},
  {t:'h',x:'כללי הרשאות'},
  {t:'code',x:'{\n  "permissions": {\n    "allow": [\n      "Bash(npm run test *)",\n      "Bash(git diff *)",\n      "Bash(git status *)"\n    ],\n    "ask": [\n      "Bash(git push *)"\n    ],\n    "deny": [\n      "Read(./.env)",\n      "Read(./secrets/**)"\n    ],\n    "defaultMode": "acceptEdits"\n  }\n}'},
  {t:'list',x:['התחביר: `Tool(specifier)`. ללא סוגריים = כל השימושים בכלי.','`Bash(git diff *)` מתאים לכל פקודה שמתחילה ב־`git diff`. **הרווח לפני `*` חשוב**: בלעדיו `git diff*` יתאים גם ל־`git diff-index`.','**deny גובר** על allow, ופועל בכל מצב, גם ב־`bypassPermissions`.','`/fewer-permission-prompts` סורק את הסשנים שלכם ומציע כללי allow לפקודות קריאה שחוזרות.']},
  {t:'h',x:'סנדבוקס'},
  {t:'p',x:'`/sandbox` מפעיל מצב בידוד ברמת מערכת ההפעלה (בפלטפורמות נתמכות): פקודות ה־shell רצות עם הגבלות גישה לקבצים וברשת. זו שכבת הגנה נוספת מעל ההרשאות ואחד האמצעים לאפשר אוטונומיה בביטחון.'},
  {t:'h',x:'עוד הגדרות נפוצות'},
  {t:'list',x:['`model` — מודל ברירת מחדל','`env` — משתני סביבה לסשנים','`hooks` — ראו שיעור קודם','`defaultMode` — מצב הרשאות התחלתי']},
  {t:'callout',k:'tip',x:'שלבו בין שכבות: כללי הצוות ב־`.claude/settings.json` (בגיט), והעדפות אישיות ב־`settings.local.json`. כך אין צורך להסביר לכל מצטרף חדש איך להגדיר.'},
  {t:'callout',k:'warn',x:'חסמו קריאה של קבצי סודות עם כללי deny. אל תסתמכו על כך ש־Claude «לא יסתכל».'}
 ],
 recap:['סדר עדיפויות: מנוהל > שורת פקודה > local > project > user.','`Tool(specifier)` עם `allow`, `ask`, `deny`; deny תמיד גובר.','`/sandbox` מוסיף בידוד; `/permissions` ו־`/config` לניהול.'],
 quiz:[
  {q:'איזה קובץ מתאים להגדרות אישיות לפרויקט שלא ייכנסו לגיט?',o:['`.claude/settings.json`','`~/.claude/settings.json`','`.claude/settings.local.json`','`.mcp.json`'],a:2,w:'`settings.local.json` הוא אישי לפרויקט ואינו משותף.'},
  {q:'כלל deny וכלל allow מתנגשים. מה גובר?',o:['allow','deny','הראשון ברשימה','האחרון ברשימה'],a:1,w:'deny חוסם בכל המצבים.'},
  {q:'מה ההבדל בין `Bash(git diff *)` ל־`Bash(git diff*)`?',o:['אין הבדל','השני מתאים גם ל־`git diff-index` כי אין רווח לפני הכוכבית','הראשון חוסם','השני מאפשר הכל'],a:1,w:'הרווח לפני `*` יוצר התאמה למילה שלמה בלבד.'}
 ]
}
);
