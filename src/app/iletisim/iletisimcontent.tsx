import { Mail, Phone } from "lucide-react";

export default function IletisimContent() {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">İletişim</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              E-Kekemelik ve Armoni Dil ve Konuşma Merkezi ile ilgili
              sorularınız, önerileriniz veya iş birliği talepleriniz için bize
              ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Card */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100 flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-slate-600 font-semibold mb-1">E-posta</div>
                <a
                  href="mailto:info@armonikekemeliktedavisi.com"
                  className="text-lg text-blue-700 hover:underline font-medium"
                >
                  info@armonikekemeliktedavisi.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-slate-600 font-semibold mb-1">Telefon</div>
                <a
                  href="tel:+902324215145"
                  className="text-lg text-blue-700 hover:underline font-medium"
                >
                  0 (232) 421 51 45
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
