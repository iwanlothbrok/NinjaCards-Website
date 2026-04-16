type ProfileLike = Record<string, any>;

export function calculateProfileScore(profile: ProfileLike) {
  const scoring = {
    profilePhoto: profile.image ? 15 : 0,
    coverImage: profile.coverImage ? 10 : 0,
    name: profile.name || profile.firstName ? 5 : 0,
    position: profile.position ? 5 : 0,
    company: profile.company ? 3 : 0,
    bio: profile.bio ? 2 : 0,

    phone: profile.phone1 ? 8 : 0,
    email: profile.email ? 5 : 0,
    whatsapp: profile.whatsapp ? 4 : 0,
    phone2: profile.phone2 ? 2 : 0,
    email2: profile.email2 ? 1 : 0,

    linkedin: profile.linkedin ? 8 : 0,
    website: profile.website ? 6 : 0,
    instagram: profile.instagram ? 4 : 0,
    facebook: profile.facebook ? 3 : 0,
    youtube: profile.youtube ? 2 : 0,
    tiktok: profile.tiktok ? 1 : 0,
    twitter: profile.twitter ? 1 : 0,

    calendly: profile.calendly ? 4 : 0,
    googleReview: profile.googleReview ? 4 : 0,
    videoUrl: profile.videoUrl ? 2 : 0,

    viber: profile.viber ? 1 : 0,
    telegram: profile.telegram ? 1 : 0,
    revolut: profile.revolut ? 1 : 0,
    trustpilot: profile.trustpilot ? 1 : 0,
    pdf: profile.pdf ? 1 : 0,
  };

  const score = Math.min(Object.values(scoring).reduce((sum, value) => sum + value, 0), 100);

  const keyFields = [
    profile.image,
    profile.coverImage,
    profile.name || profile.firstName,
    profile.position,
    profile.company,
    profile.bio,
    profile.phone1,
    profile.email,
    profile.linkedin || profile.website || profile.instagram,
    profile.whatsapp || profile.viber || profile.telegram,
    profile.calendly || profile.googleReview,
  ];

  const completionPct = Math.round((keyFields.filter(Boolean).length / keyFields.length) * 100);

  const missing = {
    profilePhoto: !profile.image,
    coverImage: !profile.coverImage,
    name: !(profile.name || profile.firstName),
    position: !profile.position,
    company: !profile.company,
    bio: !profile.bio,
    phone: !profile.phone1,
    whatsapp: !profile.whatsapp,
    linkedin: !profile.linkedin,
    website: !profile.website,
    video: !profile.videoUrl,
    calendly: !profile.calendly,
    googleReview: !profile.googleReview,
  };

  return {
    score,
    completionPct,
    scoring,
    missing,
  };
}
