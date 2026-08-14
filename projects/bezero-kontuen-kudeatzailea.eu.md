# Bezero Kontuen Kudeatzailea

**Bezeroen kontu eta pasahitzen kudeatzailea** · C# / .NET · kontsolako aplikazioa

C#-en garatutako programa bat, enpresa baten ("AllSecurity") bezeroen kontuak eta
pasahitzak kudeatzeko: kontuak sortu, bilatu, eta haien kredentzialak plataformaz
eta motaz antolatuta mantendu. Proiektuak bi bertsio ditu, eta interesgarriena
bien arteko jauzia da.

## v1-etik v2-ra: bilakaera

**v1**-ek modurik zuzenean ebazten zuen arazoa: `Program.cs` bakarra, datuak
arrayetan gordeta eta ikuspegi prozedurala. Funtzionatzen zuen, baina dena
fitxategi bakarrean zegoen.

**v2** berridazketa oso bat da, **objektuei zuzendutako programazioa** aplikatuz
eta erantzukizunak moduluetan banatuz. Birdiseinu horrek bihurtzen du ariketa
bat proiektu:

- **`Kontua`** — Kontua klasea, eremu pribatuekin, getter/setter-ekin eta
  null-coalescing (`?? ""`) erabiltzen duen eraikitzaile batekin, balio nuluen
  aurka babesteko.
- **`Estatistikak`** — denbora errealeko estatistikak `Dictionary<string,int>`
  erabiliz, kontuak motaka eta plataformaka zenbatuz.
- **`Fitxategiak_kudeatu`** — fitxategietatik inportatzea eta esportatzea,
  lerroak `File.ReadAllLines` eta `.Split(",")` bidez analizatuz datuak
  iraunarazteko.
- **`Segurtasuna`** — **segurtasun-auditoria** modulu bat, kontu guztiak
  arakatzen dituena eta pasahitz ahulak (8 karaktere baino gutxiago) dituztenak
  markatzen dituena, zenbat eta zein diren seguruak ez diren jakinaraziz.

## Zer erakusten duen

- **Objektuei zuzendutako** diseinu erreala: kapsulaketa, modulartasuna eta
  erantzukizunen banaketa.
- C#-eko datu-egituren menderatzea: arrayak, `List<>` eta `Dictionary<>`.
- **Fitxategietako iraunkortasuna** (inportatu/esportatu) eta datuen analisia.
- **Segurtasun-jarrera**: pasahitzen auditoria-modulua "datuak gordetzea" ez
  ezik, kredentzial ahulak detektatzea pentsatzetik sortzen da.
- **Iteratzeko eta birfaktorizatzeko** gaitasuna: proiektu bat bertsio
  prozedural batetik OOP arkitektura mantengarri batera eramatea.

## Teknologiak

C# · .NET · OOP (klaseak, getter/setter-ak, modulartasuna) · `List` ·
`Dictionary` · fitxategien kudeaketa · kontsolako interfazea.

## Kodea

- 2. bertsioa (uneko, OOP): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea-v2>
- 1. bertsioa (jatorrizkoa, prozedurala): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea>

> Egoera: garapenean. v2 hazten jarraitzen du bilaketa aurreratu eta estatistika
> funtzio berriekin.
