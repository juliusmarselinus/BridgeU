// Rekomendasi Kategori Minat based on Title
export function recommendKategori(judul: string, kategoriList: any[]): number[] {
  if (!judul) return [];
  const normalizedTitle = judul.toLowerCase();

  const mapping: { [key: string]: string[] } = {
    "Riset & Pengembangan": ["riset", "research", "pengembangan", "development", "ai", "machine learning", "deep learning", "science", "sains", "data", "analisis", "analyst", "survei", "survey", "academic", "akademik", "studi", "study"],
    "Teknologi & Produk Digital": ["web", "app", "mobile", "software", "developer", "coding", "program", "programmer", "database", "jaringan", "it", "cyber", "ai", "machine learning", "data scientist", "data analyst", "system", "sistem", "komputer", "frontend", "backend", "fullstack", "react", "python", "sql", "flutter", "aws", "cloud"],
    "Desain & Kreatif": ["desain", "design", "ui", "ux", "figma", "illustrator", "photoshop", "graphic", "visual", "art", "creative", "multimedia", "dkv", "video", "editing", "animasi", "content", "konten", "copywriter", "writer", "penulis", "creative direction"],
    "Bisnis & Pemasaran": ["marketing", "pemasaran", "seo", "sem", "social media", "content", "copywriting", "bisnis", "business", "manajemen", "management", "project", "product", "sales", "penjualan", "hr", "sumber daya", "startup", "growth"],
    "Keuangan & Akuntansi": ["finance", "keuangan", "akuntansi", "accounting", "pajak", "tax", "audit", "excel", "investasi", "bank", "perbankan", "fintech"],
    "Sains & Teknologi": ["sains", "science", "teknologi", "technology", "lab", "laboratorium", "fisika", "kimia", "biologi", "matematika", "statistika", "bio", "rekayasa"],
    "Sosial & Humaniora": ["sosial", "social", "humaniora", "psikologi", "hukum", "politik", "sejarah", "bahasa", "sastra", "komunikasi", "sosiologi", "antropologi"]
  };

  const scored: { id: number; score: number }[] = [];

  kategoriList.forEach(k => {
    const kName = k.nama_kategori;
    let score = 0;

    const words = kName.toLowerCase().split(/[\s&]+/);
    words.forEach((w: string) => {
      if (w.length > 2 && normalizedTitle.includes(w)) {
        score += 2.0;
      }
    });

    const keywords = mapping[kName] || [];
    keywords.forEach(kw => {
      if (normalizedTitle.includes(kw)) {
        score += 1.0;
        const kwRegex = new RegExp(`\\b${kw}\\b`);
        if (kwRegex.test(normalizedTitle)) {
          score += 1.0;
        }
      }
    });

    if (score > 0) {
      scored.push({ id: k.id, score });
    }
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.id);
}

// Rekomendasi Program Studi & Skills based on Title & Kategori Minat
export function recommendItems(
  judul: string,
  selectedKategoriIds: number[],
  kategoriList: any[],
  items: any[],
  nameField: string
): number[] {
  if (!judul && selectedKategoriIds.length === 0) return [];

  const normalizedTitle = judul.toLowerCase();

  const selectedKategoriNames = selectedKategoriIds
    .map(id => kategoriList.find(k => k.id === id)?.nama_kategori || "")
    .filter(Boolean)
    .map(name => name.toLowerCase());

  const searchString = `${normalizedTitle} ${selectedKategoriNames.join(" ")}`;

  const associations: { [key: string]: string[] } = {
    "ai": ["python", "machine learning", "deep learning", "kecerdasan buatan", "data science", "tensorflow", "pytorch", "artificial intelligence", "informatika", "komputer", "sistem informasi"],
    "machine": ["python", "machine learning", "data science", "artificial intelligence", "informatika", "komputer"],
    "learning": ["python", "machine learning", "data science", "artificial intelligence", "informatika", "komputer"],
    "web": ["react", "javascript", "typescript", "html", "css", "frontend", "backend", "fullstack", "node", "next.js", "nextjs", "vue", "angular", "web", "website", "informatika", "sistem informasi"],
    "aplikasi": ["react", "javascript", "typescript", "frontend", "backend", "fullstack", "android", "ios", "flutter", "mobile", "informatika", "sistem informasi"],
    "mobile": ["react", "flutter", "react native", "swift", "kotlin", "android", "ios", "mobile", "informatika", "sistem informasi"],
    "software": ["react", "javascript", "typescript", "node", "python", "java", "c++", "git", "software", "development", "informatika", "sistem informasi"],
    "data": ["python", "sql", "pandas", "data analyst", "data scientist", "tableau", "power bi", "excel", "statistika", "informatika", "sistem informasi", "matematika"],
    "database": ["sql", "mysql", "postgresql", "mongodb", "database", "sistem informasi", "informatika"],
    "jaringan": ["jaringan", "networking", "cisco", "cybersecurity", "keamanan", "informatika", "sistem komputer"],
    "desain": ["desain", "design", "ui", "ux", "figma", "illustrator", "photoshop", "graphic", "visual", "art", "creative", "multimedia", "dkv"],
    "design": ["desain", "design", "ui", "ux", "figma", "illustrator", "photoshop", "graphic", "visual", "art", "creative", "multimedia", "dkv"],
    "ui": ["desain", "design", "ui", "ux", "figma", "frontend", "visual", "dkv"],
    "ux": ["desain", "design", "ui", "ux", "figma", "visual", "sistem informasi"],
    "video": ["video", "editing", "premiere", "after effects", "creative", "multimedia", "dkv"],
    "konten": ["content", "konten", "creative", "writing", "copywriting", "marketing", "sosial media", "dkv", "ilmu komunikasi"],
    "marketing": ["marketing", "pemasaran", "seo", "sem", "social media", "content", "copywriting", "digital marketing", "manajemen", "ilmu komunikasi"],
    "pemasaran": ["marketing", "pemasaran", "seo", "sem", "social media", "content", "copywriting", "digital marketing", "manajemen", "ilmu komunikasi"],
    "bisnis": ["business", "bisnis", "manajemen", "sistem informasi", "analisis bisnis", "akuntansi", "keuangan"],
    "business": ["business", "bisnis", "manajemen", "sistem informasi", "analisis bisnis", "akuntansi", "keuangan"],
    "keuangan": ["finance", "keuangan", "akuntansi", "accounting", "pajak", "excel", "manajemen"],
    "finance": ["finance", "keuangan", "akuntansi", "accounting", "pajak", "excel", "manajemen"],
    "akuntansi": ["akuntansi", "accounting", "audit", "pajak", "tax", "excel", "keuangan"],
    "accounting": ["akuntansi", "accounting", "audit", "pajak", "tax", "excel", "keuangan"],
    "audit": ["akuntansi", "accounting", "audit", "excel"],
    "manajemen": ["manajemen", "management", "project", "product", "hr", "sumber daya", "bisnis", "business"],
    "management": ["manajemen", "management", "project", "product", "hr", "sumber daya", "bisnis", "business"]
  };

  const targetTerms = new Set<string>();
  const words = searchString.split(/[\s,./()_-]+/).filter(w => w.length > 1);

  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    targetTerms.add(lowerWord);
    if (associations[lowerWord]) {
      associations[lowerWord].forEach(term => targetTerms.add(term.toLowerCase()));
    }
  });

  const recommendations: { id: number; score: number }[] = [];

  items.forEach(item => {
    const name = item[nameField].toLowerCase();
    let score = 0;

    targetTerms.forEach(term => {
      if (name.includes(term)) {
        score += 1;
        const termRegex = new RegExp(`\\b${term}\\b`);
        if (termRegex.test(name)) {
          score += 1.5;
        }
      }
    });

    if (score > 0) {
      recommendations.push({ id: item.id, score });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .map(r => r.id);
}
