// Report templates (English + Bangla) following the NeuroCluster standard report format.
// NOTE: "meningioma" text is the approved standard format. The glioma / pituitary /
// no-tumor / generic texts follow the same structure and should be reviewed by a clinician.

export const LABELS = {
  en: {
    title: 'NEUROCLUSTER AI - RADIOLOGY & DIAGNOSTIC REPORT',
    patientName: 'Patient Name',
    age: 'Age',
    gender: 'Gender',
    platformModule: 'Platform Module',
    studyType: 'Study Type',
    timestamp: 'Analysis Timestamp',
    s1: '1. SCAN METADATA & PROTOCOL:',
    modality: 'Modality',
    sequence: 'Sequence',
    confidence: 'AI Model Confidence Score',
    s2: '2. KEY RADIOLOGICAL FINDINGS:',
    lesion: 'Intracranial Lesion',
    location: 'Location & Characteristics',
    massEffect: 'Mass Effect',
    ventricles: 'Ventricles & Midline',
    s3: '3. AI PREDICTIVE IMPRESSION:',
    primary: 'Primary Diagnosis (AI Match)',
    differential: 'Differential Considerations',
    s4: '4. CLINICAL RECOMMENDATIONS:',
    inspection: 'Image Inspection Window',
    disclaimerLabel: 'Disclaimer:',
    disclaimer:
      'This AI-generated automated report from NeuroCluster AI is for prototype reference only and should not replace professional medical diagnosis. Consult a qualified healthcare provider for clinical interpretation.',
    moduleValue: 'Intelligent MRI Analysis Engine v1.0',
    studyValue: 'Brain MRI (Axial T1-weighted with contrast)',
    timestampValue: 'Automated Inference Pipeline',
    modalityValue: 'Magnetic Resonance Imaging (MRI)',
    sequenceValue: 'Axial T1-weighted contrast-enhanced scan',
    genders: { male: 'Male', female: 'Female', other: 'Other' },
    reportDate: 'Report Date',
    reportId: 'Report ID',
    confHigh: 'High-probability classification match.',
    confMid: 'Moderate-probability classification match.',
    confLow: 'Low-probability classification match; manual specialist review is strongly advised.',
  },
  bn: {
    title: 'নিউরোক্লাস্টার এআই - রেডিওলজি ও ডায়াগনস্টিক রিপোর্ট',
    patientName: 'রোগীর নাম',
    age: 'বয়স',
    gender: 'লিঙ্গ',
    platformModule: 'প্লাটফর্ম মডিউল',
    studyType: 'পরীক্ষার ধরণ',
    timestamp: 'বিশ্লেষণের সময়',
    s1: '১. স্ক্যান মেটাডেটা ও প্রোটোকল:',
    modality: 'মডালিটি',
    sequence: 'সিকোয়েন্স',
    confidence: 'এআই মডেল কনফিডেন্স স্কোর',
    s2: '২. মূল রেডিওলজিক্যাল পর্যবেক্ষণসমূহ:',
    lesion: 'মস্তিষ্কের অভ্যন্তরীন টিউমার/লেশন',
    location: 'অবস্থান ও বৈশিষ্ট্য',
    massEffect: 'মস্তিষ্কের ওপর চাপ (Mass Effect)',
    ventricles: 'ভেন্ট্রিকল ও মিডলাইন',
    s3: '৩. এআই প্রিডিক্টিভ ইম্প্রেশন:',
    primary: 'প্রাথমিক রোগ নির্ণয় (এআই ম্যাচ)',
    differential: 'অন্যান্য সম্ভাবনা',
    s4: '৪. চিকিৎসাগত পরামর্শ ও সুপারিশ:',
    inspection: 'ইমেজ ইন্সপেকশন উইন্ডো',
    disclaimerLabel: 'সতর্কতা:',
    disclaimer:
      'নিউরোক্লাস্টার এআই (NeuroCluster AI) থেকে তৈরিকৃত এই স্বয়ংক্রিয় প্রোটোটাইপ রিপোর্টটি শুধুমাত্র রেফারেন্সের জন্য এবং এটি পেশাদার চিকিৎসকের মূল্যের বিকল্প নয়। সঠিক চিকিৎসা ও রোগ নির্ণয়ের জন্য রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।',
    moduleValue: 'ইন্টেলিজেন্ট এমআরআই অ্যানালাইসিস ইঞ্জিন ভি১.০',
    studyValue: 'ব্রেন এমআরআই (এক্সিয়াল টি-ওয়ান কন্ট্রাস্ট-ইনহ্যান্সড)',
    timestampValue: 'স্বয়ংক্রিয় এআই ইনফ্লুয়েন্স পাইপলাইন',
    modalityValue: 'ম্যাগনেটিক রেজোন্যান্স ইমেজিং (এমআরআই)',
    sequenceValue: 'এক্সিয়াল টি-ওয়ান কন্ট্রাস্ট-ইনহ্যান্সড স্ক্যান',
    genders: { male: 'পুরুষ', female: 'নারী', other: 'অন্যান্য' },
    reportDate: 'রিপোর্টের তারিখ',
    reportId: 'রিপোর্ট আইডি',
    confHigh: 'উচ্চ-সম্ভাব্যতা সম্পন্ন ক্লাসিফিকেশন ম্যাচ।',
    confMid: 'মাঝারি-সম্ভাব্যতা সম্পন্ন ক্লাসিফিকেশন ম্যাচ।',
    confLow: 'নিম্ন-সম্ভাব্যতা সম্পন্ন ক্লাসিফিকেশন ম্যাচ; বিশেষজ্ঞ দ্বারা ম্যানুয়াল পর্যালোচনা অত্যন্ত জরুরি।',
  },
};

// **text** = bold
const CONTENT = {
  meningioma: {
    en: {
      lesion: 'A well-circumscribed, homogenously hyperintense extra-axial mass is identified in the cranial region.',
      location: 'The lesion appears extra-axially situated, characteristic of dural-based pathology.',
      massEffect: 'Mild local mass effect with compression on adjacent brain parenchyma is noted.',
      ventricles: 'Midline structures and ventricular system require multi-planar volumetric correlation.',
      primary: 'Features are highly characteristic of a **Meningioma** (Extra-axial dural-based mass).',
      differential: 'Schwannoma or other benign/malignant dural-based extra-axial neoplasms.',
      recs: [
        'Clinical correlation with patient symptoms and neurological examination.',
        'Immediate **neurosurgical consultation** for further clinical management and surgical evaluation.',
        'Recommend complete multi-planar MRI protocols (T2, FLAIR, Sagittal/Coronal views) for precise localization.',
      ],
    },
    bn: {
      lesion: 'ক্র্যানিয়াল অঞ্চলে একটি সুনির্দিষ্ট, সুগঠিত এবং হোমোজেনাসলি হাইপারইনটেন্স এক্সট্রা-অ্যাক্সিয়াল পিণ্ড লক্ষ্য করা গেছে।',
      location: 'লেশনটি এক্সট্রা-অ্যাক্সিয়াল অবস্থানে রয়েছে, যা ডিউরা-বেসড প্যাথলজির ইঙ্গিত দেয়।',
      massEffect: 'টিউমারটির কারণে আশেপাশের মস্তিষ্কের টিস্যুর ওপর সামান্য স্থানীয় চাপ বা কম্প্রেশন লক্ষ্য করা গেছে।',
      ventricles: 'মিডলাইন স্ট্রাকচার এবং ভেন্ট্রিকুলার সিস্টেমের বিস্তারিত মূল্যায়নের জন্য মাল্টি-প্লানার সিকোয়েন্স প্রয়োজন।',
      primary: 'চিত্রের বৈশিষ্ট্যগুলো **মেনিনজিওমা (Meningioma)** বা এক্সট্রা-অ্যাক্সিয়াল ডিউরা-বেসড টিউমারের সাথে অত্যন্ত সামঞ্জস্যপূর্ণ।',
      differential: 'সোয়ানোমা (Schwannoma) অথবা সমগোত্রীয় অন্যান্য এক্সট্রা-অ্যাক্সিয়াল নিওপ্লাজম।',
      recs: [
        'রোগীর শারীরিক লক্ষণ এবং স্নায়বিক পরীক্ষার সাথে রিপোর্টের ফলাফল মিলিয়ে দেখা।',
        'পরবর্তী ব্যবস্থাপনা ও চিকিৎসার জন্য অবিলম্বে একজন **নিউরোসার্জারি বিশেষজ্ঞের** পরামর্শ নেওয়া।',
        'নিখুঁত চিকিৎসাগত পরিকল্পনার জন্য সম্পূর্ণ মাল্টি-প্লানার এমআরআই প্রোটোকল (টি-টু, ফ্লেয়ার, স্যাজিটাল/করোনাল ভিউ) সম্পন্ন করার সুপারিশ করা হলো।',
      ],
    },
  },

  glioma: {
    en: {
      lesion: 'An intra-axial mass lesion with ill-defined, infiltrative margins is identified within the brain parenchyma.',
      location: 'The lesion appears intra-axially situated with heterogeneous signal characteristics, suggestive of an infiltrative glial pathology.',
      massEffect: 'Local mass effect with possible perilesional edema and compression of adjacent brain parenchyma is suspected.',
      ventricles: 'Midline structures and ventricular system require multi-planar volumetric correlation.',
      primary: 'Features are suggestive of a **Glioma** (Intra-axial infiltrative glial neoplasm).',
      differential: 'Metastasis, primary CNS lymphoma, or other intra-axial neoplastic/non-neoplastic lesions.',
      recs: [
        'Clinical correlation with patient symptoms and neurological examination.',
        'Urgent **neurosurgical / neuro-oncology consultation** for further clinical management.',
        'Recommend complete multi-planar MRI protocols (T2, FLAIR, DWI, post-contrast views) for precise characterization.',
      ],
    },
    bn: {
      lesion: 'মস্তিষ্কের টিস্যুর ভেতরে অস্পষ্ট ও ছড়িয়ে পড়া (ইনফিল্ট্রেটিভ) সীমানাযুক্ত একটি ইন্ট্রা-অ্যাক্সিয়াল পিণ্ড লক্ষ্য করা গেছে।',
      location: 'লেশনটি ইন্ট্রা-অ্যাক্সিয়াল অবস্থানে রয়েছে এবং এর সিগন্যাল বৈশিষ্ট্য হেটেরোজেনাস, যা ইনফিল্ট্রেটিভ গ্লিয়াল প্যাথলজির ইঙ্গিত দেয়।',
      massEffect: 'আশেপাশের মস্তিষ্কের টিস্যুর ওপর স্থানীয় চাপ এবং লেশনের চারপাশে সম্ভাব্য ফোলা (এডিমা) থাকার সন্দেহ রয়েছে।',
      ventricles: 'মিডলাইন স্ট্রাকচার এবং ভেন্ট্রিকুলার সিস্টেমের বিস্তারিত মূল্যায়নের জন্য মাল্টি-প্লানার সিকোয়েন্স প্রয়োজন।',
      primary: 'চিত্রের বৈশিষ্ট্যগুলো **গ্লায়োমা (Glioma)** বা ইন্ট্রা-অ্যাক্সিয়াল গ্লিয়াল টিউমারের ইঙ্গিত দেয়।',
      differential: 'মেটাস্টেসিস, প্রাইমারি সিএনএস লিম্ফোমা অথবা অন্যান্য ইন্ট্রা-অ্যাক্সিয়াল টিউমার বা অ-টিউমারজনিত লেশন।',
      recs: [
        'রোগীর শারীরিক লক্ষণ এবং স্নায়বিক পরীক্ষার সাথে রিপোর্টের ফলাফল মিলিয়ে দেখা।',
        'পরবর্তী ব্যবস্থাপনার জন্য জরুরি ভিত্তিতে একজন **নিউরোসার্জারি / নিউরো-অনকোলজি বিশেষজ্ঞের** পরামর্শ নেওয়া।',
        'নিখুঁত মূল্যায়নের জন্য সম্পূর্ণ মাল্টি-প্লানার এমআরআই প্রোটোকল (টি-টু, ফ্লেয়ার, ডিডব্লিউআই, কন্ট্রাস্ট-পরবর্তী ভিউ) সম্পন্ন করার সুপারিশ করা হলো।',
      ],
    },
  },

  pituitary: {
    en: {
      lesion: 'A well-defined mass lesion is identified in the sellar / suprasellar region.',
      location: 'The lesion appears centered at the sella turcica, characteristic of a pituitary region pathology.',
      massEffect: 'Possible mass effect on the optic chiasm and adjacent suprasellar structures cannot be excluded.',
      ventricles: 'Midline structures and ventricular system require multi-planar volumetric correlation.',
      primary: 'Features are suggestive of a **Pituitary Tumor** (Sellar/suprasellar mass, adenoma pattern).',
      differential: "Craniopharyngioma, Rathke's cleft cyst, or other sellar/parasellar lesions.",
      recs: [
        'Clinical correlation with patient symptoms, visual field assessment and neurological examination.',
        '**Endocrinology and neurosurgical consultation** with hormonal profile evaluation.',
        'Recommend a dedicated pituitary MRI protocol (thin-section coronal and sagittal views) for precise localization.',
      ],
    },
    bn: {
      lesion: 'সেলার / সুপ্রাসেলার অঞ্চলে একটি সুনির্দিষ্ট পিণ্ড লক্ষ্য করা গেছে।',
      location: 'লেশনটি সেলা টারসিকা-কেন্দ্রিক অবস্থানে রয়েছে, যা পিটুইটারি অঞ্চলের প্যাথলজির ইঙ্গিত দেয়।',
      massEffect: 'অপটিক কায়াজম এবং আশেপাশের সুপ্রাসেলার অংশে চাপ থাকার সম্ভাবনা উড়িয়ে দেওয়া যায় না।',
      ventricles: 'মিডলাইন স্ট্রাকচার এবং ভেন্ট্রিকুলার সিস্টেমের বিস্তারিত মূল্যায়নের জন্য মাল্টি-প্লানার সিকোয়েন্স প্রয়োজন।',
      primary: 'চিত্রের বৈশিষ্ট্যগুলো **পিটুইটারি টিউমার (Pituitary Tumor)** বা সেলার/সুপ্রাসেলার পিণ্ডের ইঙ্গিত দেয়।',
      differential: 'ক্র্যানিওফ্যারিঞ্জিওমা, র‍্যাথকে’স ক্লেফট সিস্ট অথবা অন্যান্য সেলার/প্যারাসেলার লেশন।',
      recs: [
        'রোগীর শারীরিক লক্ষণ, দৃষ্টিক্ষেত্র পরীক্ষা এবং স্নায়বিক পরীক্ষার সাথে রিপোর্টের ফলাফল মিলিয়ে দেখা।',
        'হরমোন প্রোফাইল পরীক্ষাসহ একজন **এন্ডোক্রাইনোলজি ও নিউরোসার্জারি বিশেষজ্ঞের** পরামর্শ নেওয়া।',
        'নিখুঁত মূল্যায়নের জন্য বিশেষায়িত পিটুইটারি এমআরআই প্রোটোকল (পাতলা-সেকশন করোনাল ও স্যাজিটাল ভিউ) সম্পন্ন করার সুপারিশ করা হলো।',
      ],
    },
  },

  notumor: {
    en: {
      lesion: 'No definite intracranial mass lesion is identified on the submitted image.',
      location: 'No abnormal focal extra-axial or intra-axial lesion is evident in the analyzed slice.',
      massEffect: 'No significant mass effect or midline shift is evident on the analyzed image.',
      ventricles: 'Midline structures and ventricular system require multi-planar volumetric correlation.',
      primary: '**No Tumor Detected.** No features matching a tumor class were identified by the AI model.',
      differential: 'Not applicable. A normal AI result does not exclude small or subtle pathology.',
      recs: [
        'Clinical correlation with patient symptoms and neurological examination.',
        'Consult a physician if symptoms persist, even when the AI result is normal.',
        'Complete multi-planar MRI protocols (T2, FLAIR, Sagittal/Coronal views) if clinical suspicion remains.',
      ],
    },
    bn: {
      lesion: 'জমা দেওয়া ছবিতে মস্তিষ্কের ভেতরে কোনো সুনির্দিষ্ট পিণ্ড বা টিউমার লক্ষ্য করা যায়নি।',
      location: 'বিশ্লেষিত স্লাইসে কোনো অস্বাভাবিক এক্সট্রা-অ্যাক্সিয়াল বা ইন্ট্রা-অ্যাক্সিয়াল লেশন দেখা যায়নি।',
      massEffect: 'বিশ্লেষিত ছবিতে উল্লেখযোগ্য কোনো চাপ (Mass Effect) বা মিডলাইন শিফট দেখা যায়নি।',
      ventricles: 'মিডলাইন স্ট্রাকচার এবং ভেন্ট্রিকুলার সিস্টেমের বিস্তারিত মূল্যায়নের জন্য মাল্টি-প্লানার সিকোয়েন্স প্রয়োজন।',
      primary: '**কোনো টিউমার শনাক্ত হয়নি।** এআই মডেল টিউমারের কোনো ক্লাসের সাথে মিলে যায় এমন বৈশিষ্ট্য খুঁজে পায়নি।',
      differential: 'প্রযোজ্য নয়। এআই-এর স্বাভাবিক ফলাফল ছোট বা সূক্ষ্ম কোনো সমস্যা বাদ দেয় না।',
      recs: [
        'রোগীর শারীরিক লক্ষণ এবং স্নায়বিক পরীক্ষার সাথে রিপোর্টের ফলাফল মিলিয়ে দেখা।',
        'এআই ফলাফল স্বাভাবিক হলেও উপসর্গ থাকলে চিকিৎসকের পরামর্শ নেওয়া।',
        'ক্লিনিক্যাল সন্দেহ থাকলে সম্পূর্ণ মাল্টি-প্লানার এমআরআই প্রোটোকল (টি-টু, ফ্লেয়ার, স্যাজিটাল/করোনাল ভিউ) সম্পন্ন করার সুপারিশ করা হলো।',
      ],
    },
  },

  // Fallback for any other tumor label returned by the model
  generic: {
    en: {
      lesion: 'An abnormal mass-like lesion is identified in the cranial region.',
      location: 'Exact location and compartment (intra-axial vs. extra-axial) require specialist review.',
      massEffect: 'Possible local mass effect on adjacent brain parenchyma cannot be excluded.',
      ventricles: 'Midline structures and ventricular system require multi-planar volumetric correlation.',
      primary: 'Features are suggestive of a **{label}** (AI classification).',
      differential: 'Other benign/malignant intracranial neoplasms; specialist review recommended.',
      recs: [
        'Clinical correlation with patient symptoms and neurological examination.',
        'Prompt **neurosurgical consultation** for further clinical management.',
        'Recommend complete multi-planar MRI protocols (T2, FLAIR, Sagittal/Coronal views) for precise localization.',
      ],
    },
    bn: {
      lesion: 'ক্র্যানিয়াল অঞ্চলে একটি অস্বাভাবিক পিণ্ড-সদৃশ লেশন লক্ষ্য করা গেছে।',
      location: 'লেশনের সুনির্দিষ্ট অবস্থান (ইন্ট্রা-অ্যাক্সিয়াল নাকি এক্সট্রা-অ্যাক্সিয়াল) নির্ণয়ে বিশেষজ্ঞের পর্যালোচনা প্রয়োজন।',
      massEffect: 'আশেপাশের মস্তিষ্কের টিস্যুর ওপর স্থানীয় চাপ থাকার সম্ভাবনা উড়িয়ে দেওয়া যায় না।',
      ventricles: 'মিডলাইন স্ট্রাকচার এবং ভেন্ট্রিকুলার সিস্টেমের বিস্তারিত মূল্যায়নের জন্য মাল্টি-প্লানার সিকোয়েন্স প্রয়োজন।',
      primary: 'চিত্রের বৈশিষ্ট্যগুলো **{label}** (এআই ক্লাসিফিকেশন) এর ইঙ্গিত দেয়।',
      differential: 'অন্যান্য সৌম্য/ম্যালিগন্যান্ট ইন্ট্রাক্র্যানিয়াল নিওপ্লাজম; বিশেষজ্ঞের পর্যালোচনা প্রয়োজন।',
      recs: [
        'রোগীর শারীরিক লক্ষণ এবং স্নায়বিক পরীক্ষার সাথে রিপোর্টের ফলাফল মিলিয়ে দেখা।',
        'পরবর্তী ব্যবস্থাপনার জন্য দ্রুত একজন **নিউরোসার্জারি বিশেষজ্ঞের** পরামর্শ নেওয়া।',
        'নিখুঁত চিকিৎসাগত পরিকল্পনার জন্য সম্পূর্ণ মাল্টি-প্লানার এমআরআই প্রোটোকল (টি-টু, ফ্লেয়ার, স্যাজিটাল/করোনাল ভিউ) সম্পন্ন করার সুপারিশ করা হলো।',
      ],
    },
  },
};

/** Map raw model label -> report class key. */
export function classifyLabel(rawLabel) {
  const l = String(rawLabel || '').toLowerCase().replace(/[\s-]+/g, '_').trim();
  if (l.includes('no_tumor') || l.includes('notumor') || l.includes('normal') || l.includes('healthy') || l === 'no') {
    return 'notumor';
  }
  if (l.includes('meningioma')) return 'meningioma';
  if (l.includes('glioma')) return 'glioma';
  if (l.includes('pituitary')) return 'pituitary';
  return 'generic';
}

export function confidenceBand(score) {
  if (score >= 85) return 'High';
  if (score >= 60) return 'Mid';
  return 'Low';
}

/** Returns report body text for the selected language. */
export function getReportBody(classKey, lang, rawLabel) {
  const body = CONTENT[classKey][lang];
  const pretty = String(rawLabel || 'Tumor').replace(/_/g, ' ');
  const fill = (s) => s.replace('{label}', pretty);
  return {
    ...body,
    primary: fill(body.primary),
    recs: body.recs.map(fill),
  };
}
