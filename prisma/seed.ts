import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL environment variable is required for seeding.");
  }

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is required for seeding."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin user created:", admin.email);

  const samplePosts = [
    {
      title: "ABS Beyni Arızası Belirtileri ve Çözümleri",
      slug: "abs-beyni-arizasi-belirtileri",
      excerpt:
        "ABS uyarı lambası yandığında ne yapmalısınız? En yaygın ABS arıza belirtileri ve profesyonel çözüm önerileri.",
      content: `## ABS Beyni Nedir?

ABS (Anti-lock Braking System) beyni, aracınızın fren sisteminin en kritik elektronik bileşenlerinden biridir. Bu modül, tekerleklerin kilitlenmesini önleyerek güvenli frenleme sağlar.

## Yaygın Arıza Belirtileri

- ABS uyarı lambasının sürekli yanması
- Fren pedalında anormal titreşim
- Frenleme sırasında tıklama sesi
- ESP/ASR sistemlerinin devre dışı kalması

## Ne Yapmalısınız?

ABS arızası tespit ettiğinizde en kısa sürede uzman bir servise başvurmanız önemlidir. Erken müdahale, daha büyük sorunların önüne geçmenizi sağlar.

## Profesyonel Tamir Süreci

Uzman ekibimiz modern test cihazları ile arızayı teşhis eder ve garantili onarım hizmeti sunar.`,
      category: "ABS Tamiri",
      author: "ABS'ci Mustafa",
      status: "published",
      publishedAt: new Date("2024-01-15"),
      seoTitle: "ABS Beyni Arızası Belirtileri | Profesyonel Çözümler",
      seoDescription:
        "ABS beyni arızası belirtileri, nedenleri ve profesyonel tamir çözümleri hakkında kapsamlı rehber.",
    },
    {
      title: "ABS Modülü Bakımı: Uzun Ömürlü Kullanım İçin İpuçları",
      slug: "abs-modulu-bakimi-ipuclari",
      excerpt:
        "ABS modülünüzün ömrünü uzatmak için dikkat etmeniz gereken bakım ipuçları ve öneriler.",
      content: `## Düzenli Kontrol Önemli

ABS modülünüzün sağlıklı çalışması için düzenli kontroller yaptırmanız önemlidir.

## Bakım İpuçları

1. **Fren hidroliğini** belirtilen aralıklarla değiştirin
2. **Elektrik bağlantılarını** düzenli kontrol ettirin
3. **Korozyon** oluşumuna karşı önlem alın
4. **Profesyonel teşhis** yaptırın

## Uyarı İşaretlerine Dikkat

Dashboard üzerindeki uyarı lambalarını asla görmezden gelmeyin.`,
      category: "Bakım",
      author: "ABS'ci Mustafa",
      status: "published",
      publishedAt: new Date("2024-02-20"),
      seoTitle: "ABS Modülü Bakımı | Uzun Ömürlü Kullanım Rehberi",
      seoDescription:
        "ABS modülünüzün ömrünü uzatmak için profesyonel bakım ipuçları ve öneriler.",
    },
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Sample blog posts created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
