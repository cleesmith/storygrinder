// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node
const {
    GoogleGenAI,
    HarmCategory,
    HarmBlockThreshold,
    createUserContent,
    createPartFromUri,
} = require('@google/genai');

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    temperature: 0,
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-pro-preview-05-06';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `
Show the truly misspelled words in this list, as in the words not in an English dictionary, use this format:
1. word - reason why it's flagged
newline
2. word -  reason why it's flagged
newline

adorbz alrighty app apps aren armoire backlit badass bambam bedstand bestest bio bizonco blansky blog blowhard bluetooth bubba bullcrap cabbie caf cartney chaperone chapstick churchy cinderblock clawfoot columbo couldn countertop crapola creeped crosshairs cubbies dangly debutante diabotical didn dity doesn dokey dominics doorframe doozy downton dreamt dupa eff elwoods eyeing facebook farlan faux fi fied fj fjmc flyers flynne flynni friggin fundraiser fundraisers gangly gangsta geez ghostbusters glaming gmail googling gunday gurl hadn handatlas hari hasn heebie hmm honeyboo hoodie horatios horsenuts housecats hypotheticals ish isn itty jeebies kittee lainie landmine lesh lifes lingonberries lingonberry looky lordy luceee matinee meowzer mitochondrial mmm moby mojitos moley motherlode noir nutso ochre offline ogg okey omg overcomplicating overthink packin packrat paperclip peasy phosgene pic pinot postulant pre ravenwood rearview reclusively relatable repointing richway rigamarole rolex rolltop rootin sabi saut sayonara searchable selfies sho shouldn sideward slinked smarty snubbies speakerphone stieler stovetop thingies til timeframe timeline timelines timestamp tootin truthhound tso twinkies umm unbothered uncirculated unmailed ve vintagey voicemails voil wabi wasn watchlist weaponize weren wh worstest wouldn wtf yada yay youtuber yumballs zoid zumba `, },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
