import React, { useState, FormEvent } from 'react';
import '../session.css';

interface Country {
  name: string;
  code: string;
  maxLength: number; // Max phone number length (excluding country code)
}

const countries: Country[] = [
  { name: 'Afghanistan', code: '+93', maxLength: 9 },
  { name: 'Albania', code: '+355', maxLength: 9 },
  { name: 'Algeria', code: '+213', maxLength: 9 },
  { name: 'Andorra', code: '+376', maxLength: 6 },
  { name: 'Angola', code: '+244', maxLength: 9 },
  { name: 'Argentina', code: '+54', maxLength: 10 },
  { name: 'Armenia', code: '+374', maxLength: 8 },
  { name: 'Australia', code: '+61', maxLength: 9 },
  { name: 'Austria', code: '+43', maxLength: 10 },
  { name: 'Azerbaijan', code: '+994', maxLength: 9 },
  { name: 'Bahamas', code: '+1242', maxLength: 7 },
  { name: 'Bahrain', code: '+973', maxLength: 8 },
  { name: 'Bangladesh', code: '+880', maxLength: 10 },
  { name: 'Barbados', code: '+1246', maxLength: 7 },
  { name: 'Belarus', code: '+375', maxLength: 9 },
  { name: 'Belgium', code: '+32', maxLength: 9 },
  { name: 'Belize', code: '+501', maxLength: 7 },
  { name: 'Benin', code: '+229', maxLength: 8 },
  { name: 'Bhutan', code: '+975', maxLength: 8 },
  { name: 'Bolivia', code: '+591', maxLength: 8 },
  { name: 'Bosnia and Herzegovina', code: '+387', maxLength: 8 },
  { name: 'Botswana', code: '+267', maxLength: 8 },
  { name: 'Brazil', code: '+55', maxLength: 11 },
  { name: 'Brunei', code: '+673', maxLength: 7 },
  { name: 'Bulgaria', code: '+359', maxLength: 9 },
  { name: 'Burkina Faso', code: '+226', maxLength: 8 },
  { name: 'Burundi', code: '+257', maxLength: 8 },
  { name: 'Cabo Verde', code: '+238', maxLength: 7 },
  { name: 'Cambodia', code: '+855', maxLength: 9 },
  { name: 'Cameroon', code: '+237', maxLength: 9 },
  { name: 'Canada', code: '+1', maxLength: 10 },
  { name: 'Central African Republic', code: '+236', maxLength: 8 },
  { name: 'Chad', code: '+235', maxLength: 8 },
  { name: 'Chile', code: '+56', maxLength: 9 },
  { name: 'China', code: '+86', maxLength: 11 },
  { name: 'Colombia', code: '+57', maxLength: 10 },
  { name: 'Comoros', code: '+269', maxLength: 7 },
  { name: 'Congo (DRC)', code: '+243', maxLength: 9 },
  { name: 'Congo (Republic)', code: '+242', maxLength: 9 },
  { name: 'Costa Rica', code: '+506', maxLength: 8 },
  { name: 'Croatia', code: '+385', maxLength: 9 },
  { name: 'Cuba', code: '+53', maxLength: 8 },
  { name: 'Cyprus', code: '+357', maxLength: 8 },
  { name: 'Czech Republic', code: '+420', maxLength: 9 },
  { name: 'Denmark', code: '+45', maxLength: 8 },
  { name: 'Djibouti', code: '+253', maxLength: 8 },
  { name: 'Dominica', code: '+1767', maxLength: 7 },
  { name: 'Dominican Republic', code: '+1809', maxLength: 7 }, // Note: Multiple codes, using primary
  { name: 'Ecuador', code: '+593', maxLength: 9 },
  { name: 'Egypt', code: '+20', maxLength: 10 },
  { name: 'El Salvador', code: '+503', maxLength: 8 },
  { name: 'Equatorial Guinea', code: '+240', maxLength: 9 },
  { name: 'Eritrea', code: '+291', maxLength: 7 },
  { name: 'Estonia', code: '+372', maxLength: 8 },
  { name: 'Eswatini', code: '+268', maxLength: 8 },
  { name: 'Ethiopia', code: '+251', maxLength: 9 },
  { name: 'Fiji', code: '+679', maxLength: 7 },
  { name: 'Finland', code: '+358', maxLength: 9 },
  { name: 'France', code: '+33', maxLength: 9 },
  { name: 'Gabon', code: '+241', maxLength: 8 },
  { name: 'Gambia', code: '+220', maxLength: 7 },
  { name: 'Georgia', code: '+995', maxLength: 9 },
  { name: 'Germany', code: '+49', maxLength: 11 },
  { name: 'Ghana', code: '+233', maxLength: 9 },
  { name: 'Greece', code: '+30', maxLength: 10 },
  { name: 'Grenada', code: '+1473', maxLength: 7 },
  { name: 'Guatemala', code: '+502', maxLength: 8 },
  { name: 'Guinea', code: '+224', maxLength: 9 },
  { name: 'Guinea-Bissau', code: '+245', maxLength: 7 },
  { name: 'Guyana', code: '+592', maxLength: 7 },
  { name: 'Haiti', code: '+509', maxLength: 8 },
  { name: 'Honduras', code: '+504', maxLength: 8 },
  { name: 'Hungary', code: '+36', maxLength: 9 },
  { name: 'Iceland', code: '+354', maxLength: 7 },
  { name: 'India', code: '+91', maxLength: 10 },
  { name: 'Indonesia', code: '+62', maxLength: 11 },
  { name: 'Iran', code: '+98', maxLength: 10 },
  { name: 'Iraq', code: '+964', maxLength: 10 },
  { name: 'Ireland', code: '+353', maxLength: 9 },
  { name: 'Israel', code: '+972', maxLength: 9 },
  { name: 'Italy', code: '+39', maxLength: 10 },
  { name: 'Jamaica', code: '+1876', maxLength: 7 },
  { name: 'Japan', code: '+81', maxLength: 10 },
  { name: 'Jordan', code: '+962', maxLength: 9 },
  { name: 'Kazakhstan', code: '+7', maxLength: 10 },
  { name: 'Kenya', code: '+254', maxLength: 9 },
  { name: 'Kiribati', code: '+686', maxLength: 8 },
  { name: 'Korea (North)', code: '+850', maxLength: 10 },
  { name: 'Korea (South)', code: '+82', maxLength: 10 },
  { name: 'Kosovo', code: '+383', maxLength: 8 },
  { name: 'Kuwait', code: '+965', maxLength: 8 },
  { name: 'Kyrgyzstan', code: '+996', maxLength: 9 },
  { name: 'Laos', code: '+856', maxLength: 9 },
  { name: 'Latvia', code: '+371', maxLength: 8 },
  { name: 'Lebanon', code: '+961', maxLength: 8 },
  { name: 'Lesotho', code: '+266', maxLength: 8 },
  { name: 'Liberia', code: '+231', maxLength: 9 },
  { name: 'Libya', code: '+218', maxLength: 9 },
  { name: 'Liechtenstein', code: '+423', maxLength: 7 },
  { name: 'Lithuania', code: '+370', maxLength: 8 },
  { name: 'Luxembourg', code: '+352', maxLength: 9 },
  { name: 'Madagascar', code: '+261', maxLength: 9 },
  { name: 'Malawi', code: '+265', maxLength: 9 },
  { name: 'Malaysia', code: '+60', maxLength: 9 },
  { name: 'Maldives', code: '+960', maxLength: 7 },
  { name: 'Mali', code: '+223', maxLength: 8 },
  { name: 'Malta', code: '+356', maxLength: 8 },
  { name: 'Marshall Islands', code: '+692', maxLength: 7 },
  { name: 'Mauritania', code: '+222', maxLength: 8 },
  { name: 'Mauritius', code: '+230', maxLength: 8 },
  { name: 'Mexico', code: '+52', maxLength: 10 },
  { name: 'Micronesia', code: '+691', maxLength: 7 },
  { name: 'Moldova', code: '+373', maxLength: 8 },
  { name: 'Monaco', code: '+377', maxLength: 9 },
  { name: 'Mongolia', code: '+976', maxLength: 8 },
  { name: 'Montenegro', code: '+382', maxLength: 8 },
  { name: 'Morocco', code: '+212', maxLength: 9 },
  { name: 'Mozambique', code: '+258', maxLength: 9 },
  { name: 'Myanmar', code: '+95', maxLength: 9 },
  { name: 'Namibia', code: '+264', maxLength: 9 },
  { name: 'Nauru', code: '+674', maxLength: 7 },
  { name: 'Nepal', code: '+977', maxLength: 10 },
  { name: 'Netherlands', code: '+31', maxLength: 9 },
  { name: 'New Zealand', code: '+64', maxLength: 9 },
  { name: 'Nicaragua', code: '+505', maxLength: 8 },
  { name: 'Niger', code: '+227', maxLength: 8 },
  { name: 'Nigeria', code: '+234', maxLength: 10 },
  { name: 'North Macedonia', code: '+389', maxLength: 8 },
  { name: 'Norway', code: '+47', maxLength: 8 },
  { name: 'Oman', code: '+968', maxLength: 8 },
  { name: 'Pakistan', code: '+92', maxLength: 10 },
  { name: 'Palau', code: '+680', maxLength: 7 },
  { name: 'Panama', code: '+507', maxLength: 8 },
  { name: 'Papua New Guinea', code: '+675', maxLength: 7 },
  { name: 'Paraguay', code: '+595', maxLength: 9 },
  { name: 'Peru', code: '+51', maxLength: 9 },
  { name: 'Philippines', code: '+63', maxLength: 10 },
  { name: 'Poland', code: '+48', maxLength: 9 },
  { name: 'Portugal', code: '+351', maxLength: 9 },
  { name: 'Qatar', code: '+974', maxLength: 8 },
  { name: 'Romania', code: '+40', maxLength: 9 },
  { name: 'Russia', code: '+7', maxLength: 10 },
  { name: 'Rwanda', code: '+250', maxLength: 9 },
  { name: 'Saint Kitts and Nevis', code: '+1869', maxLength: 7 },
  { name: 'Saint Lucia', code: '+1758', maxLength: 7 },
  { name: 'Saint Vincent and the Grenadines', code: '+1784', maxLength: 7 },
  { name: 'Samoa', code: '+685', maxLength: 7 },
  { name: 'San Marino', code: '+378', maxLength: 10 },
  { name: 'Sao Tome and Principe', code: '+239', maxLength: 7 },
  { name: 'Saudi Arabia', code: '+966', maxLength: 9 },
  { name: 'Senegal', code: '+221', maxLength: 9 },
  { name: 'Serbia', code: '+381', maxLength: 9 },
  { name: 'Seychelles', code: '+248', maxLength: 7 },
  { name: 'Sierra Leone', code: '+232', maxLength: 8 },
  { name: 'Singapore', code: '+65', maxLength: 8 },
  { name: 'Slovakia', code: '+421', maxLength: 9 },
  { name: 'Slovenia', code: '+386', maxLength: 8 },
  { name: 'Solomon Islands', code: '+677', maxLength: 7 },
  { name: 'Somalia', code: '+252', maxLength: 9 },
  { name: 'South Africa', code: '+27', maxLength: 9 },
  { name: 'South Sudan', code: '+211', maxLength: 9 },
  { name: 'Spain', code: '+34', maxLength: 9 },
  { name: 'Sri Lanka', code: '+94', maxLength: 9 },
  { name: 'Sudan', code: '+249', maxLength: 9 },
  { name: 'Suriname', code: '+597', maxLength: 7 },
  { name: 'Sweden', code: '+46', maxLength: 9 },
  { name: 'Switzerland', code: '+41', maxLength: 9 },
  { name: 'Syria', code: '+963', maxLength: 9 },
  { name: 'Taiwan', code: '+886', maxLength: 9 },
  { name: 'Tajikistan', code: '+992', maxLength: 9 },
  { name: 'Tanzania', code: '+255', maxLength: 9 },
  { name: 'Thailand', code: '+66', maxLength: 9 },
  { name: 'Timor-Leste', code: '+670', maxLength: 8 },
  { name: 'Togo', code: '+228', maxLength: 8 },
  { name: 'Tonga', code: '+676', maxLength: 7 },
  { name: 'Trinidad and Tobago', code: '+1868', maxLength: 7 },
  { name: 'Tunisia', code: '+216', maxLength: 8 },
  { name: 'Turkey', code: '+90', maxLength: 10 },
  { name: 'Turkmenistan', code: '+993', maxLength: 8 },
  { name: 'Tuvalu', code: '+688', maxLength: 6 },
  { name: 'Uganda', code: '+256', maxLength: 9 },
  { name: 'Ukraine', code: '+380', maxLength: 9 },
  { name: 'United Arab Emirates', code: '+971', maxLength: 9 },
  { name: 'United Kingdom', code: '+44', maxLength: 10 },
  { name: 'United States', code: '+1', maxLength: 10 },
  { name: 'Uruguay', code: '+598', maxLength: 8 },
  { name: 'Uzbekistan', code: '+998', maxLength: 9 },
  { name: 'Vanuatu', code: '+678', maxLength: 7 },
  { name: 'Vatican City', code: '+379', maxLength: 8 },
  { name: 'Venezuela', code: '+58', maxLength: 10 },
  { name: 'Vietnam', code: '+84', maxLength: 10 },
  { name: 'Yemen', code: '+967', maxLength: 9 },
  { name: 'Zambia', code: '+260', maxLength: 9 },
  { name: 'Zimbabwe', code: '+263', maxLength: 9 },
];

const Session: React.FC = () => {
  const [country, setCountry] = useState(countries[0].code);
  const [phone, setPhone] = useState('');
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedCountry = countries.find((c) => c.code === country) || countries[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fullPhone = `${country}${phone}`.trim().replace(/[^\w\s]/g, '');
    setIsLoading(true);
    try {
      const response = await fetch(`/api/proxy?phone=${fullPhone}`, {
        method: 'GET',
      });
      const data = await response.json();
      setSessionCode(data.code);
    } catch (error) {
      console.error('Error fetching session code:', error);
      setSessionCode('Error fetching code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="session-container">
      <h1 className="session-title">Get Your Session Code</h1>
      <div className={`session-content ${isLoading ? 'loading' : ''}`}>
        {!sessionCode && !isLoading ? (
          <form className="session-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="session-input"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group phone-group">
              <span className="country-code">{country}</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLength))}
                placeholder={`Enter ${selectedCountry.maxLength}-digit number`}
                className="session-input phone-input"
                maxLength={selectedCountry.maxLength}
                required
              />
            </div>
            <button type="submit" className="session-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Get Session'}
            </button>
          </form>
        ) : isLoading ? (
          <div className="ghost-loader">
            <div className="loader-circle"></div>
            <p>Generating your session code...</p>
          </div>
        ) : (
          <div className="session-code-container">
            <p className="session-code-label">Your Session Code:</p>
            <div className="session-code-box">
              <span className="session-code">{sessionCode}</span>
              <button onClick={copyToClipboard} className="copy-button">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Session;