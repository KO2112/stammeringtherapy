"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Award,
  Globe,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  X,
  MapPin,
  Clock,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  experience: string;
  specialization: string;
  description: string;
  achievements: string[];
  education: string;
  location: string;
  languages: string[];
  workingHours: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
}

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    story: false,
    approach: false,
    team: false,
  });

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "50px" };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.id.replace("-section", "");
          setIsVisible((prev) => ({ ...prev, [sectionName]: true }));
        }
      });
    }, observerOptions);

    // Observe sections
    const sections = [
      "stats-section",
      "story-section",
      "approach-section",
      "team-section",
    ];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const teamMembers: TeamMember[] = [
    // Serdar KILINÇLAR
    {
      id: 1,
      name: "Serdar KILINÇLAR",
      title: "Kurucu - Dil ve Konuşma Terapisti",
      experience: "23+ Yıl Deneyim",
      specialization: "Kekemelik Tedavisi",
      description: "Kekemelik tedavisinde uzman ve kurucu terapis",
      achievements: [
        "Kekemelik terapisi ve kontrolü",
        "Çocuk ve yetişkinlerle çalışma",
        "Dil ve konuşma bozuklukları eğitimi",
        "Çoklu lisans ve pedagojik formasyon",
        "Armoni Eğitim Merkezi kuruculuğu",
      ],
      education: `Lisans – Tınaztepe Üniversitesi Dil ve Konuşma Terapisi Bölümü '25\nLisans – İstanbul Üniversitesi Çocuk Gelişimi Bölümü '22\nLisans – Anadolu Üniversitesi Edebiyat Fakültesi Sosyoloji Bölümü ‘15\nLisans – Anadolu Üniversitesi İşletme Fakültesi İşletme Bölümü ‘09\nLisans – Pamukkale Üniversitesi Mühendislik Fakültesi Makine Mühendisliği ‘08\nPedagojik Formasyon - Demokrasi Üniversitesi Eğitim Bilimleri Fakültesi`,
      location: "İstanbul, Türkiye",
      languages: ["Türkçe", "İngilizce", "Almanca"],
      workingHours: "Pazartesi - Cuma: 09:00 - 18:00",
      email: "serdar@armoni.com",
      phone: "+90 212 555 0101",
      bio: `1984 yılında Manisa’da doğdu. Lise eğitimini Manisa Dündar Çiloğlu Anadolu Lisesi’nde tamamladıktan sonra Pamukkale Üniversitesi Makine Mühendisliği’nden 2008 yılında mezun oldu. Mühendislik eğitimi sırasında ikinci üniversite olarak eğitime hak kazandığı Eskişehir Anadolu Üniversitesi İşletme Bölümü’ne başladı ve 2009 yılında mezun oldu. 2012 yılında başlamış olduğu Eskişehir Anadolu Üniversitesi Sosyoloji Bölümünden 2015 yılında mezun oldu.\n\n6 yaşında geçirmiş olduğu havale sonucu kekemelik problemi yaşamaya başlayan ve 17 sene bu problemi yaşayan Serdar Kılınçlar, 23 yaşında aldığı eğitimlerle kekemeliğini kontrol altına almayı başardıktan sonra dil ve konuşma bozuklukları problemi olan bireylere yardımcı olmak için 2008 yılında Armoni Eğitim Merkezi'ni kurmuştur. 2019 yılında merkezini Milli Eğitim Bakanlığı bünyesine taşıyan Serdar Kılınçlar, uzman eğitmen kadrosuyla, İzmir Bornova'da, Dil ve Konuşma Güçlüğü - Özel Öğrenme Güçlüğü konularıyla ve Özel Armoni Özel Eğitim Merkezi adıyla faaliyetlerine devam etmektedir.`,
      image: "/serdar-kilinclar.jpg",
    },
    // Ezgi Sultan KAYA
    {
      id: 2,
      name: "Ezgi Sultan KAYA",
      title: "Odyoloji ve Konuşma Bozuklukları Uzmanı",
      experience: "15+ Yıl Deneyim",
      specialization: "Odyoloji",
      description: "İşitme ve konuşma bozuklukları alanında uzman",
      achievements: [
        "Odyoloji ve konuşma bozuklukları uzmanlığı",
        "Ebeveyn-Çocuk Etkileşim Terapisi (PALIN PCI)",
        "Nörolojik rehabilitasyon (afazi, apraksi, disfaji, dizartri, yüz felci)",
        "Erken müdahale ve oyun terapisi",
        "İşitme kayıplı çocuklarda rehabilitasyon",
        "Çocuk gelişimi ve pedagojik formasyon",
      ],
      education: `Lisans: İstanbul Üniversitesi Çocuk Gelişimi\nYüksek Lisans: Ege Üniversitesi Sağlık Bilimleri Enstitüsü Odyoloji ve Konuşma Bozuklukları Yüksek Lisans Programı\nPedagojik Formasyon: Ege Üniversitesi Eğitim Fakültesi`,
      location: "Ankara, Türkiye",
      languages: ["Türkçe", "İngilizce"],
      workingHours: "Pazartesi - Cumartesi: 08:30 - 17:30",
      email: "ezgi@armoni.com",
      phone: "+90 312 555 0102",
      bio: `Yüksek lisans eğitimi boyunca Ege Üniversitesi Hastanesi Kulak Burun Boğaz Anabilim Dalı'nda zorunlu stajını yapmıştır. Yine Ege Üniversitesi Hastanesi'nde birçok proje ve eğitimde yer alarak çalışmalar yapmıştır. 2018 yılından bu yana Armoni Eğitim Merkezi'nde Odyoloji ve Konuşma Bozuklukları Uzmanı olarak görevini sürdürmektedir.\n\nKurs ve Eğitimler\n• TEDİL ( Türkçe Erken Dil Gelişim Testi) Uygulama ve Puanlama Eğitimi, KONMER.\n• TODİL ( Türkçe Okul Çağı Dil Gelişim Testi) Uygulama ve Puanlama Eğitimi, KONMER.\n• PALIN PCI: Ebeveyn-Çocuk Etkileşim Terapisi, Kevin Paul Fower.\n• Peabody Resim-Kelime Tanıma Testi Uygulayıcı Eğitimi, Psikoterapi ve Psikoloji Uygulamaları Enstitüsü, Uzm. Klinik Psikolog Beril Zeynep Hacıosman.\n• Kekeleyen Yetişkin Bireylere Yönelik Klinik Karar Verme veTerapide Karşılaşılan Güçlükler, Prof.Dr. E. Charles Healey.\n•Hızlı-Bozuk Konuşmada Değerlendirme ve Terapi, Prof.Dr. Kurt Eggers.\n• Erken Müdahale Yaklaşım ve Teknikleri: Duyu Bütünleme ve Dil Terapisi Etkinliklerinin Birlikte Kullanımı, Prof. Dr. Celeste Roseberry-McKibbin.\n• Oyun İçinde Duyusal Farkındalık, Odyoloji ve Konuşma Bozuklukları Uzmanı İclal Ertaş.\n• İşitme Kayıplı Çocuklarda Erken Bebeklikten Okul Çağına İşitsel Rehabilitasyon, Odyoloji ve Konuşma Bozuklukları Uzmanı İclal Ertaş.\n• Dil ve Konuşma Terapisi Alanında Nörolojik Rehabilitasyon (Akut ve Postakut Nörolojik Rehabilitasyon), Dil ve Konuşma Terapisti Aybüke Yıldırım, DİLGEM.\n• Dil ve Konuşma Terapisi Alanında Nörolojik Rehabilitasyon (Facialisparese/Yüz Felci), Dil ve Konuşma Terapisti Aybüke Yıldırım, DİLGEM.\n• Dil ve Konuşma Terapisi Alanında Nörolojik Rehabilitasyon (Afazi), Dil ve Konuşma Terapisti Aybüke Yıldırım, DİLGEM.\n• Dil ve Konuşma Terapisi Alanında Nörolojik Rehabilitasyon (Apraksi), Dil ve Konuşma Terapisti Aybüke Yıldırım, DİLGEM.\n• Dil ve Konuşma Terapisi Alanında Nörolojik Rehabilitasyon (Dizartri), Dil ve Konuşma Terapisti Aybüke Yıldırım, DİLGEM.\n•DIR Floortime 101 Eğitimi, Uzm. Dkt. N. Egemen Nakışçı.\n• AGTE (Ankara Gelişim Tarama Envanteri) Uygulayıcı Eğitimi, Psikoterapi ve Psikoloji Uygulamaları Enstitüsü, Uzm. Klinik Psikolog Beril Zeynep Hacıosman.\n• Oyun Terapisi Uygulayıcı Eğitimi, Psikoterapi ve Psikoloji Uygulamaları Enstitüsü, Uzm. Klinik Psikolog Beril Zeynep Hacıosman.\n• TILLS Testi Uygulayıcı Eğitimi, Psikoterapi ve Psikoloji Uygulamaları Enstitüsü, Uzm. Klinik Psikolog Beril Zeynep Hacıosman.\n• Disleksi Eğitici Eğitimi, Türkiye Disleksi Vakfı.\n• Down Sendromlu Bireylerde Konuşma Problemleri, Nar Taneleri Özel Eğitim Kurumları.\n• Ekolali, Nar Taneleri Özel Eğitim Kurumları.\n• Dil ve Konuşma Problemlerinin Değerlendirilmesi, Nar Taneleri Özel Eğitim Kurumları.\n• ENG/VNG, Video Head Impulse (VHIT) ve VEMP Testlerinin Pratik Yaklaşım Kursu, Adnan Menderes Üniversitesi.\n\nBilimsel Projeler\n• Kulak Çınlaması (Tinnitus) Olan ve Kulak Çınlaması (Tinnitus) Olmayan Yetişkinlerin Benlik Saygısı, Depresif Duygulanım ve Psikosomatik Belirti Düzeylerinin Karşılaştırılması. Adnan Menderes Üniversitesi 1. Uluslararası Sağlık Bilimleri Kongresi, Aydın, 2017.\n• Fonksiyonel Disfoni Etiyolojisinde Sorgulanması Gerekenler: Farklı Bir Olgu Sunumu. Adnan Menderes Üniversitesi 1. Uluslararası Sağlık Bilimleri Kongresi, Aydın, 2017.\n• Antiepileptik Kullanımına Bağlı Diskinezide Ses Rehabilitasyonu: Nadir Bir Olgu Sunumu. Adnan Menderes Üniversitesi 1. Uluslararası Sağlık Bilimleri Kongresi, Aydın, 2017.\n• Bilateral İleri Derece İşitme Kayıplı Bireylerde Ses Handikap İndeksi 10 (VHI 10), GRBAS Skalası ve Sesin Akustik Özelliklerinin Karşılaştırılması. Ege Üniversitesi Yüksek Lisans Bitirme Tezi, İzmir, 2018.\n\nKongre ve Seminerler\n• 2016, ‘’Ulusal Odyoloji Kongresi’’, Cerrahpaşa Tıp Fakültesi, İstanbul, Türkiye.\n• 2016, ‘’8. Ulusal Odyoloji ve Konuşma Bozuklukları Kongresi’’, Türkiye Odyoloji & Konuşma-Ses Derneği, Ankara, Türkiye.\n• 2017, ‘’Adnan Menderes Üniversitesi 1. Uluslararası Sağlık Bilimleri Kongresi’’, Aydın, Türkiye.\n•2020, ‘’Ulusal Disiplinlerarası Çocuk Sempozyumu’’.`,
      image: "/ezgi-sultan2.jpg",
    },
    // Ebru ÇELİK
    {
      id: 3,
      name: "Ebru ÇELİK",
      title: "Odyoloji ve Konuşma Bozuklukları Uzmanı",
      experience: "12+ Yıl Deneyim",
      specialization: "Konuşma Bozuklukları",
      description: "Çocuk ve yetişkin konuşma terapisi uzmanı",
      achievements: [
        "Odyoloji ve konuşma bozuklukları uzmanlığı",
        "Çocuk ve yetişkin konuşma terapisi",
        "Klinik staj ve uygulama deneyimi",
        "Kongre ve seminer katılımı",
        "Aile danışmanlığı ve grup terapileri",
      ],
      education: `Lisans: İstanbul Aydın Üniversitesi Odyoloji Bölümü\nYüksek Lisans: Ege Üniversitesi Odyoloji ve Konuşma Bozuklukları Yüksek Lisans Programı`,
      location: "İzmir, Türkiye",
      languages: ["Türkçe", "İngilizce", "Fransızca"],
      workingHours: "Salı - Cumartesi: 09:00 - 18:00",
      email: "ebru@armoni.com",
      phone: "+90 232 555 0103",
      bio: `STAJLAR:\n2016 (Ağustos-Ekim) Ankara Atatürk Eğitim Araştırma Hastanesi (1 Ay Yaz Stajı)\n2016-2017 Hacettepe Üniversitesi Hastanesi (Stajyer, Klinik Staj)\n2017 (Mart-Mayıs) Ankara Kavaklıdere Odyoloji ve İşitme Merkezi (1 Ay Staj)\n2018-2020 Ege Üniversitesi Hastanesi (Stajyer, Klinik Staj)\n\nKONGRE VE SEMİNERLER:\nVertigoya İnterdisipliner Yaklaşım Sempozyumu, Hacettepe Üniversitesi, Nisan 2016\n2. Uluslararası Katılımlı Odyoloji Öğrenci Kongresi, Hacettepe Üniversitesi, Mayıs 2016\n1. İşitme - Konuşma ve Ses Bozuklukları Sempozyumu, İşitme Konuşma Bilimcileri Derneği, Ankara, Haziran 2016\nKoklear İmplantlı Çocuklarda İşitsel Sözel Gelişim ve AB ile Koklear İmplantlı Çocukların Eğitimi, Ankara, (Advanced Bionics), Nisan 2017\n3. Uluslarası Katılımlı Odyoloji Öğrenci Kongresi, Hacettepe Üniversitesi, Mayıs 2017\nEge Üniversitesi KBB Anabilim Dalı 2. Foniatri Sempozyumu, İzmir, Aralık 2019\nVAI Global Virtual Summit: An Update on Vestibular System, Online Sempozyum, Temmuz 2020`,
      image: "/ebru-celik.jpg",
    },
    // Halime ÖZEL
    {
      id: 6,
      name: "Halime ÖZEL",
      title: "Psikolojik Danışmanlık ve Rehberlik",
      experience: "14+ Yıl Deneyim",
      specialization: "Psikolojik Destek",
      description: "Konuşma güçlüklerinin psikolojik boyutu uzmanı",
      achievements: [
        "Psikolojik danışmanlık ve rehberlik",
        "Aile danışmanlığı ve oyun terapisi",
        "Çocuk ve ergenlerde projektif testler",
        "Çocuk değerlendirme ve dikkat testleri",
        "Kadın danışma merkezi ve özel eğitim deneyimi",
      ],
      education: `LİSANS: Ege Üniversitesi Psikolojik Danışmanlık ve Rehberlik\nYÜKSEK LİSANS: Ege Üniversitesi Psikolojik Danışmanlık ve Rehberlik Yüksek Lisans Programı\nAile Danışmanlığı (İzmir Demokrasi Üniversitesi)`,
      location: "Eskişehir, Türkiye",
      languages: ["Türkçe", "İngilizce"],
      workingHours: "Pazartesi - Cumartesi: 09:30 - 18:30",
      email: "halime@armoni.com",
      phone: "+90 222 555 0106",
      bio: `Psikolojik danışman Halime Özel, Ege Üniversitesi Psikolojik Danışmanlık ve Rehberlik bölümünden 2019 yılında mezun olmuştur. Aynı zamanda Ege Üniversitesinde Yüksek Lisans Eğitimi almaktadır. Bununla birlikte İzmir Demokrasi Üniversitesi’nde Aile Danışmanlığı eğitimi almıştır. Bunlara ek olarak Oyun Terapisi, Çocuk Değerlendirme ve Dikkat Testleri, Çocuk ve Ergenlerde Projektif Testler eğitimleri de bulunmaktadır. Mezun olduktan sonra çocuk ve ailelerle çalışma deneyimi elde etmiş, kadın danışma merkezi, kolej ve özel eğitim merkezinde psikolojik danışmanlık yapmıştır. Şuan Armoni Eğitim Merkezinde psikolojik danışmanlık yapmakta ve aktif olarak oyun terapisi ve online psikolojik danışmanlık hizmeti vermektedir.\n\nAldığı Eğitimler ve Uyguladığı Testler\nAile Danışmanlığı (İzmir Demokrasi Üniversitesi)\nOyun Terapisi (Türkiye Sağlık Vakfı)\nÇocuk ve Ergenlerde Projektif Çizim Testleri Uygulayıcı Eğitimi (Türkiye Sağlık Vakfı)\n• Bir İnsan Çiz Testi, \n• İki İnsan Çiz Testi, \n• Organ Çizimleri, \n• Bir Aile Çiz Testi, \n• Bir Ev Çiz Testi, \n• Bir Ağaç Çiz Testi, \n• Serbest Çizim Testi. \nÇocuk Değerlendirme ve Dikkat Testleri (Türkiye Sağlık Vakfı)\n• Ankara Gelişim Envanteri (AGTE),\n•  Gesell Gelişim Figürleri Testi, \n• Peabody Resim Kelime Tanıma Testi, \n• Bender Gesltalt Görsel Motor Algı Testi, \n• D2 Dikkat Testi, \n• Goodenough Harris Bir İnsan Çiz Testi, \n• Frostig Gelişimsel-Görsel Algı Testi, \n• Benton Görsel Bellek Testi,\n•  Kelime Söyleyiş Testi, \n• Metropolitan Okul Olgunluğu Testi, \n• Catell 2-A Zeka Testi, \n• Catell 3-A Zeka Testi, \n• Porteus Labirentleri Testi, \n• Frankfurter Dikkat Testi \n\nRisk Altındaki Çocuk ve Gençlerle Çalışmak, Çok Kültürlü Okullarda Psikolojik Danışma (Türk PDR Derneği)`,
      image: "/halime-ozel.png",
    },
    // Osman Çetin
    {
      id: 4,
      name: "Osman Çetin",
      title: "Dil ve Konuşma Terapisti",
      experience: "",
      specialization: "",
      description: "",
      achievements: [],
      education: "",
      location: "",
      languages: ["Türkçe"],
      workingHours: "",
      email: "",
      phone: "",
      bio: "",
      image: "/osman-cetin.png",
    },
    // Hatice Karaoğlan
    {
      id: 5,
      name: "Hatice Karaoğlan",
      title: "Dil ve Konuşma Terapisti",
      experience: "",
      specialization: "",
      description: "",
      achievements: [],
      education: "",
      location: "",
      languages: ["Türkçe"],
      workingHours: "",
      email: "",
      phone: "",
      bio: "",
      image: "/Stammering-Therapy-logo.png",
    },
  ];

  // Helper to check if member has full profile
  const hasProfile = (member: TeamMember) => {
    // Only these IDs have full profile info
    return [1, 2, 3, 6].includes(member.id);
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Kekemelik Tedavi Ekibi"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-800"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              <span className="text-blue-300">Armoni Kekemelik Tedavisi</span>{" "}
              Hakkında
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Kekemelik sorunu yaşayan bireylerin akıcı ve güvenli konuşma
              becerisi kazanmasına yardımcı olan küresel konuşma terapisi
              uzmanları ekibi.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/hizmetlerimiz"
                className="px-6 py-3 bg-white text-blue-800 rounded-full font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg"
              >
                Hizmetlerimiz
              </Link>
              <Link
                href="/iletisim"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300"
              >
                İletişim
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* İstatistikler */}
      <section id="stats-section" className="relative z-10 -mt-12 mb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.stats ? "visible" : "hidden"}
          >
            {[
              { number: "23+", label: "Yıl Deneyim" },
              { number: "10,000+", label: "Yardım Edilen Müşteri" },
              { number: "3", label: "Küresel Bölge" },
              { number: "%100", label: "Kanıt Tabanlı" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {stat.number}
                </div>
                <p className="text-gray-700 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hikayemiz */}
      <section id="story-section" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.story ? "visible" : "hidden"}
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Users size={20} />
                </span>
                Hikayemiz
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Tek bir hedefle bir araya gelen kekemelik tedavi uzmanları
                ekibiyiz: etkili kekemelik tedavisini ihtiyacı olan herkese
                ulaştırmak.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Doğu Avrupa, Batı Avrupa ve Kuzey Amerikadan onlarca Odyoloji ve
                Konuşma Bozuklukları Uzmanı, kekemelik terapisti ve konuşma
                terapistini bir araya getiren ortak çabamız.
              </p>
              <p className="text-gray-700 leading-relaxed">
                23 yıldan fazla birleşik deneyimimizle, dünya çapında 10.000 den
                fazla kişinin kekemelik zorluklarını aşmasına ve konuşma güveni
                kazanmasına yardımcı olduk.
              </p>
              <Link
                href="/team"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group mt-4"
              >
                Ekibimizle tanışın
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div variants={fadeIn} className="relative">
              <div className="h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Kekemelik Tedavi Ekibi"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Yaklaşımımız */}
      <section
        id="approach-section"
        className="py-16 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.approach ? "visible" : "hidden"}
          >
            <h2 className="text-3xl font-bold text-gray-900">Yaklaşımımız</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto my-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kapsamlı destek sağlamak için teknolojiyi özel terapi
              teknikleriyle birleştiriyoruz.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.approach ? "visible" : "hidden"}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-32 bg-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-white mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-white">
                    E-Kekemelik Uygulaması
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Kanıt tabanlı egzersizler, kişiselleştirilmiş teknikler ve
                  kendi kendine rehberli terapi için ilerleme takibi sağlayan
                  yenilikçi dijital platformumuz.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Günlük pratik egzersizleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">İlerleme takip panosu</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Kişiselleştirilmiş terapi planı
                    </span>
                  </li>
                </ul>
                <Link
                  href="/signin"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Uygulamamız hakkında daha fazla bilgi
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-32 bg-blue-700 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-white mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-white">Özel Terapi</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Uzmanlarımız, özel kekemelik zorluklarınıza göre uyarlanmış
                  kişiselleştirilmiş bire bir terapi seansları sunar.
                  İhtiyaçlarınıza uygun hem yüz yüze hem de uzaktan seanslar
                  sunuyoruz.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Kişiselleştirilmiş terapi planları
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Yüz yüze ve uzaktan seçenekleri
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Uzman konuşma terapistleri</span>
                  </li>
                </ul>
                <Link
                  href="/hizmetlerimiz"
                  className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  Terapi hizmetlerimizi görüntüleyin
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Kadromuz Section */}
      <section
        id="team-section"
        className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={isVisible.team ? "visible" : "hidden"}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Uzman <span className="text-blue-600">Kadromuz</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Alanında uzman, deneyimli ve tutkulu terapistlerimizle tanışın.
              Her biri kekemelik tedavisinde öncü yaklaşımlar geliştiren
              profesyonellerdir.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.team ? "visible" : "hidden"}
          >
            {teamMembers.map((member, idx) => (
              <motion.div key={member.id} variants={fadeIn} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2 min-h-[500px] max-h-[500px] flex flex-col">
                  {/* Card Header with Image */}
                  <div className="relative h-32 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover object-center scale-125"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <GraduationCap className="w-4 h-4 text-white/80" />
                            <span className="text-white/80 text-sm font-medium">
                              {member.experience}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm mb-1">
                        {member.title}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        <Award className="w-3 h-3 mr-1" />
                        {member.specialization}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">
                      {member.description}
                    </p>

                    {/* Achievements */}
                    <div className="space-y-2 mb-6">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Uzmanlık Alanları:
                      </h4>
                      <div className="flex flex-col gap-1">
                        {member.achievements.slice(0, 3).map((achievement) => (
                          <div
                            key={achievement}
                            className="flex items-center text-xs text-gray-600 line-clamp-1"
                          >
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Actions removed as requested */}

                    {/* Profile Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Profili Görüntüle
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header & Content */}
              {hasProfile(selectedMember) ? (
                <>
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600">
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-6 left-6 flex items-center space-x-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={selectedMember.image}
                          alt={selectedMember.name}
                          width={128}
                          height={128}
                          className="object-cover object-center scale-150"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {selectedMember.name}
                        </h2>
                        <p className="text-blue-100">{selectedMember.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Bio */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Hakkında
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    </div>
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                          Eğitim
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {selectedMember.education}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          Lokasyon
                        </h4>
                        <p className="text-gray-600 text-sm">İzmir</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          Çalışma Saatleri
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {selectedMember.workingHours}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          Diller
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            Türkçe
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">
                        Uzmanlık Alanları
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedMember.achievements.map((achievement) => (
                          <div
                            key={achievement}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 p-8">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      width={128}
                      height={128}
                      className="object-cover object-center scale-150"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMember.name}
                  </h2>
                  <p className="text-blue-600 mb-4">{selectedMember.title}</p>
                  <p className="text-gray-500 text-center">
                    Profil bilgisi yakında eklenecek.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Yolculuğunuza Başlamaya Hazır mısınız?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Uygulama tabanlı yaklaşımımızı mı yoksa kişiselleştirilmiş terapi
            seanslarını mı tercih ederseniz edin, ekibimiz her adımda sizi
            desteklemek için burada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Uygulamayı Deneyin
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Bize Ulaşın
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-200 mr-2" />
              <span className="text-blue-100 text-sm">
                Sertifikalı Uzmanlar
              </span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-200 mr-2" />
              <span className="text-blue-100 text-sm">Küresel Destek</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-200 mr-2" />
              <span className="text-blue-100 text-sm">Esnek Zamanlama</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
