"use client";
import type React from "react";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  AtSign,
  UserPlus,
} from "lucide-react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("signin"); // 'signin', 'signup', or 'forgot'
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Registration form fields
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stutteringStartAge, setStutteringStartAge] = useState("");
  const [howStutteringStarted, setHowStutteringStarted] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");
  const [emotionsDuringStuttering, setEmotionsDuringStuttering] = useState("");
  const [previousTherapy, setPreviousTherapy] = useState("");
  const [therapyType, setTherapyType] = useState("");
  const [therapyDuration, setTherapyDuration] = useState("");
  const [therapyBenefit, setTherapyBenefit] = useState("");
  const [learnedMethods, setLearnedMethods] = useState("");
  const [therapyExpectations, setTherapyExpectations] = useState("");
  const [howHeardAbout, setHowHeardAbout] = useState("");

  // Function to get email from username
  const getEmailFromUsername = async (
    username: string
  ): Promise<string | null> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().email || null;
    } catch (error) {
      console.error("Error fetching user email:", error);
      return null;
    }
  };

  // Function to check user role
  const getUserRole = async (username: string): Promise<string | null> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().role || null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  // Check if username already exists in users collection
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  // Check if email already exists in users collection
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleUsernameSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, get the email associated with the username
      const userEmail = await getEmailFromUsername(username);
      if (!userEmail) {
        setError(
          "Kullanıcı adı bulunamadı. Lütfen kullanıcı adınızı kontrol edin."
        );
        setLoading(false);
        return;
      }

      // Check user role before allowing sign-in
      const userRole = await getUserRole(username);
      if (userRole !== "user" && userRole !== "admin") {
        setError("Kullanici etkin degil");
        setLoading(false);
        return;
      }

      // Use the retrieved email to sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, userEmail, password);
      router.push("/dashboard"); // Redirect after sign-in
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      if (errorMessage.includes("user-not-found")) {
        setError(
          "Kullanıcı bulunamadı. Hesabınız henüz onaylanmamış olabilir."
        );
      } else if (errorMessage.includes("wrong-password")) {
        setError("Yanlış şifre. Lütfen tekrar deneyin.");
      } else if (errorMessage.includes("invalid-credential")) {
        setError(
          "Geçersiz giriş bilgileri. Kullanıcı adı ve şifrenizi kontrol edin."
        );
      } else {
        setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır");
      setLoading(false);
      return;
    }

    if (username.includes(" ")) {
      setError("Kullanıcı adında boşluk olamaz");
      setLoading(false);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Ad ve soyad alanları zorunludur");
      setLoading(false);
      return;
    }

    // Registration form validation
    if (
      !birthDate ||
      !gender ||
      !profession ||
      !phoneNumber ||
      !city ||
      !district ||
      !stutteringStartAge ||
      !howStutteringStarted ||
      !familyHistory ||
      !emotionsDuringStuttering ||
      !previousTherapy ||
      !therapyExpectations ||
      !howHeardAbout
    ) {
      setError("Lütfen tüm zorunlu alanları doldurunuz");
      setLoading(false);
      return;
    }

    try {
      // Check if username already exists in users collection
      const usernameExistsInUsers = await checkUsernameExists(username);
      if (usernameExistsInUsers) {
        setError("Bu kullanıcı adı zaten kullanılıyor");
        setLoading(false);
        return;
      }

      // Check if email already exists in users collection
      const emailExistsInUsers = await checkEmailExists(email);
      if (emailExistsInUsers) {
        setError("Bu e-posta adresi zaten kullanılıyor");
        setLoading(false);
        return;
      }

      // Create user in Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore using the Auth UID
      await setDoc(doc(db, "users", user.uid), {
        username: username.toLowerCase(),
        email: email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "nouser", // Set role as "nouser" for new registrations
        createdAt: serverTimestamp(),
        // Registration form data
        birthDate: birthDate,
        gender: gender,
        profession: profession,
        phoneNumber: phoneNumber,
        city: city,
        district: district,
        stutteringStartAge: stutteringStartAge,
        howStutteringStarted: howStutteringStarted,
        familyHistory: familyHistory,
        emotionsDuringStuttering: emotionsDuringStuttering,
        previousTherapy: previousTherapy,
        therapyType: therapyType,
        therapyDuration: therapyDuration,
        therapyBenefit: therapyBenefit,
        learnedMethods: learnedMethods,
        therapyExpectations: therapyExpectations,
        howHeardAbout: howHeardAbout,
        registrationCompleted: true,
      });

      setSuccessMessage(
        "Terapi başvuru formunuz başarıyla gönderildi! En kısa sürede size dönüş yapılacaktır."
      );
      setFormType("signin");
      // Clear all form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setGender("");
      setProfession("");
      setPhoneNumber("");
      setCity("");
      setDistrict("");
      setStutteringStartAge("");
      setHowStutteringStarted("");
      setFamilyHistory("");
      setEmotionsDuringStuttering("");
      setPreviousTherapy("");
      setTherapyType("");
      setTherapyDuration("");
      setTherapyBenefit("");
      setLearnedMethods("");
      setTherapyExpectations("");
      setHowHeardAbout("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      if (errorMessage.includes("email-already-in-use")) {
        setError("Bu e-posta adresi zaten kullanılıyor");
      } else {
        setError(`Kayıt işlemi başarısız: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "Şifre sıfırlama e-postası gönderildi! Gelen kutunuzu kontrol edin."
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (formType === "signin") {
      return (
        <form onSubmit={handleUsernameSignIn} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
              Kullanıcı Adı
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="Kullanıcı Adı"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Şifre
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setFormType("forgot")}
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                >
                  Şifremi unuttum
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="••••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-slate-600"
            >
              Beni hatırla
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      );
    } else if (formType === "signup") {
      return (
        <form onSubmit={handleSignUp} className="mt-6">
          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700"
              >
                Ad *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="Adınız"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-slate-700"
              >
                Soyad *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="Soyadınız"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700"
              >
                Kullanıcı Adı *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/\s/g, "").toLowerCase())
                  }
                  className="pl-9 block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="kullaniciadi"
                  minLength={3}
                />
              </div>
              <p className="text-xs text-slate-500">
                En az 3 karakter, boşluk olmadan
              </p>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                E-posta *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AtSign className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Şifre *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="••••••••••"
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700"
              >
                Şifre Tekrar *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="••••••••••"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Kişisel Bilgiler
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-slate-700"
                >
                  Doğum Tarihi *
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-slate-700"
                >
                  Cinsiyet *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="profession"
                  className="block text-sm font-medium text-slate-700"
                >
                  Meslek *
                </label>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="Mesleğiniz"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-1">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-slate-700"
                >
                  Telefon Numarası *
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="0555 123 4567"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-slate-700"
                >
                  İl *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="Şehir"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-slate-700"
                >
                  İlçe *
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="İlçe"
                />
              </div>
            </div>
          </div>

          {/* Stuttering Information */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Kekemeliğiniz Hakkında Bilgiler
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="stutteringStartAge"
                  className="block text-sm font-medium text-slate-700"
                >
                  Kekemelik başlangıç yaşınız *
                </label>
                <input
                  id="stutteringStartAge"
                  name="stutteringStartAge"
                  type="number"
                  required
                  value={stutteringStartAge}
                  onChange={(e) => setStutteringStartAge(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="Örn: 5"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="howStutteringStarted"
                  className="block text-sm font-medium text-slate-700"
                >
                  Kekemeliğiniz nasıl başladı? *
                </label>
                <select
                  id="howStutteringStarted"
                  name="howStutteringStarted"
                  required
                  value={howStutteringStarted}
                  onChange={(e) => setHowStutteringStarted(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="Doğal">Doğal</option>
                  <option value="Öğrenilen">Öğrenilen</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label
                  htmlFor="familyHistory"
                  className="block text-sm font-medium text-slate-700"
                >
                  Ailenizde kekemelik öyküsü var mı? *
                </label>
                <textarea
                  id="familyHistory"
                  name="familyHistory"
                  required
                  value={familyHistory}
                  onChange={(e) => setFamilyHistory(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  rows={3}
                  placeholder="Aile geçmişiniz hakkında bilgi"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="emotionsDuringStuttering"
                  className="block text-sm font-medium text-slate-700"
                >
                  Kekemelik sırasında hissettiğiniz duygular *
                </label>
                <textarea
                  id="emotionsDuringStuttering"
                  name="emotionsDuringStuttering"
                  required
                  value={emotionsDuringStuttering}
                  onChange={(e) => setEmotionsDuringStuttering(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  rows={3}
                  placeholder="Örneğin; kaygı, öfke, korku"
                />
              </div>
            </div>
          </div>

          {/* Therapy and Support */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Terapi ve Destek
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="previousTherapy"
                  className="block text-sm font-medium text-slate-700"
                >
                  Daha önce terapi desteği aldınız mı? *
                </label>
                <select
                  id="previousTherapy"
                  name="previousTherapy"
                  required
                  value={previousTherapy}
                  onChange={(e) => setPreviousTherapy(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="Hayır">Hayır</option>
                  <option value="Dil ve Konuşma Terapisi">
                    Dil ve Konuşma Terapisi
                  </option>
                  <option value="Psikolojik Destek">Psikolojik Destek</option>
                  <option value="Psikiyatrik Destek">Psikiyatrik Destek</option>
                </select>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="therapyDuration"
                  className="block text-sm font-medium text-slate-700"
                >
                  Almış olduğunuz terapi süresi ve sıklığı
                </label>
                <input
                  id="therapyDuration"
                  name="therapyDuration"
                  type="text"
                  value={therapyDuration}
                  onChange={(e) => setTherapyDuration(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="Örn: 6 ay, haftada 2 kez"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label
                  htmlFor="therapyBenefit"
                  className="block text-sm font-medium text-slate-700"
                >
                  Almış olduğunuz terapiden fayda sağladınız mı?
                </label>
                <select
                  id="therapyBenefit"
                  name="therapyBenefit"
                  value={therapyBenefit}
                  onChange={(e) => setTherapyBenefit(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                  <option value="Kısmen">Kısmen</option>
                </select>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="learnedMethods"
                  className="block text-sm font-medium text-slate-700"
                >
                  Almış olduğunuz terapilerde hangi yöntemleri öğrendiniz?
                </label>
                <textarea
                  id="learnedMethods"
                  name="learnedMethods"
                  value={learnedMethods}
                  onChange={(e) => setLearnedMethods(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  rows={3}
                  placeholder="Öğrendiğiniz yöntemler"
                />
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Hedefler
            </h4>
            <div className="space-y-1">
              <label
                htmlFor="therapyExpectations"
                className="block text-sm font-medium text-slate-700"
              >
                Kekemelik terapisinden beklentileriniz nelerdir? *
              </label>
              <textarea
                id="therapyExpectations"
                name="therapyExpectations"
                required
                value={therapyExpectations}
                onChange={(e) => setTherapyExpectations(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                rows={3}
                placeholder="Terapi sürecinde hedefleriniz"
              />
            </div>
          </div>

          {/* How heard about */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Merkezimizden nasıl haberdar oldunuz?
            </h4>
            <div className="space-y-1">
              <label
                htmlFor="howHeardAbout"
                className="block text-sm font-medium text-slate-700"
              >
                Bilgi Kaynağı *
              </label>
              <select
                id="howHeardAbout"
                name="howHeardAbout"
                required
                value={howHeardAbout}
                onChange={(e) => setHowHeardAbout(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
              >
                <option value="">Seçin</option>
                <option value="Sosyal Medya">Sosyal Medya</option>
                <option value="Google Reklam">Google Reklam</option>
                <option value="Tavsiye">Tavsiye</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Başvuru gönderiliyor...
                </>
              ) : (
                <>
                  Başvuru Gönder
                  <UserPlus className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      );
    } else if (formType === "forgot") {
      return (
        <form onSubmit={handleForgotPassword} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              E-posta adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AtSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  E-posta gönderiliyor...
                </>
              ) : (
                <>
                  Şifreyi sıfırla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-xl">
        {/* Left side - Illustration */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-teal-600 to-teal-700 p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">E-Kekemelik</h1>
              </div>
              <p className="mt-6 text-3xl font-bold leading-tight">
                Online Kekemelik Platformu
              </p>
              <p className="mt-2 text-teal-100 text-lg">
                Her zaman ve her yerde
              </p>
              <div className="space-y-6 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Sesli Hikaye Okumalar
                    </h3>
                    <p className="text-teal-100">
                      Dilediğiniz Seviyedeki Hikayeleri Okuyun
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">İlerleme Takibi</h3>
                    <p className="text-teal-100">
                      İlerlemenizi takip edin. Gelişmeleri gözlemleyin
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Kekemelere Özel Sohbet Platformu
                    </h3>
                    <p className="text-teal-100">
                      Kekemeler ve terapistler ile konuşun
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900">
                {formType === "signin" && "Hoş geldiniz"}
                {formType === "signup" && "Kayıt Ol"}
                {formType === "forgot" && "Şifrenizi sıfırlayın"}
              </h2>
              <p className="mt-3 text-slate-600">
                {formType === "signin" && "Devam etmek için oturum açın"}
                {formType === "signup" &&
                  "Hesap oluşturmak için bilgilerinizi girin"}
                {formType === "forgot" &&
                  "Şifrenizi sıfırlamanız için size bir bağlantı göndereceğiz"}
              </p>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100 animate-in fade-in-0 duration-300">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-100 animate-in fade-in-0 duration-300">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {renderForm()}

            <div className="mt-8 text-center text-slate-600">
              {formType === "signin" && (
                <div className="space-y-2">
                  <p>
                    Hesabınız yok mu?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setFormType("signup");
                        setError("");
                        setSuccessMessage("");
                      }}
                      className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                    >
                      Kayıt Ol
                    </button>
                  </p>
                </div>
              )}
              {formType === "signup" && (
                <p>
                  Zaten hesabınız var mı?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormType("signin");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                  >
                    Giriş Yap
                  </button>
                </p>
              )}
              {formType === "forgot" && (
                <button
                  type="button"
                  onClick={() => {
                    setFormType("signin");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                >
                  Oturum açma sayfasına geri dön
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
