# Bezero Kontuen Kudeatzailea

**Bezeroen kontu eta pasahitzen kudeatzailea** · C#/.NET · kontsolako aplikazioa

C#-en garatutako programa bat, enpresa baten ("AllSecurity") bezeroen kontuak eta
pasahitzak kudeatzeko: kontuak sortu, bilatu, eta haien kredentzialak plataformaz
eta motaz antolatuta mantendu. Proiektuak bi bertsio ditu, eta interesgarriena
bien arteko jauzia da.

## v1-etik v2-ra: Prozesua

**v1**-ek modurik zuzenean ebazten zuen arazoa: `Program.cs` bakarra, datuak
arrayetan gordeta eta kodea prozedurala da. Funtzionatzen zuen, baina dena
fitxategi bakarrean zegoen.

**v2** berridazketa oso bat da, **objektuei zuzendutako programazioa** aplikatuz
eta kodea moduluetan banatuz.

- **`Kontua`**: Kontua klasea, eremu pribatuekin, getter/setter-ekin eta
  `?? ""` erabiltzen duen eraikitzaile batekin balio nuloen
  aurka babesteko.
- **`Estatistikak`**: denbora errealeko estatistikak `Dictionary<string,int>`
  erabiliz, kontuak motaka eta plataformaka zenbatzen ditu.
- **`Fitxategiak_kudeatu`**: fitxategietatik inportatzea eta esportatzen ditu.
- **`Segurtasuna`**: **segurtasun-auditoria** modulu bat, kontu guztiak
  analizatzen ditu eta pasahitz ahulak (8 karaktere baino gutxiago) dituztenak
  markatzen ditu. Puntuazio bat ematen dio pasahitzari eta segurtasun gomendioak esaten ditu.

## Zer erakusten duen

- **OOP** diseinua: kapsulaketa eta modulartasuna.
- C#-eko datu-egiturak: arrayak, `List<>` eta `Dictionary<>`.
- **Fitxategietako iraunkortasuna**: (inportatu/esportatu) eta datuen analisia.
- **Segurtasun-jarrera**: pasahitzen auditoria-modulua kredentzial ahulak detektatzea pentsatzetik bururatu zitzaidan.
- **Iterazioa eta birfaktorizazioa**: proiektu bat bertsio
  prozedural batetik OOP arkitektura mantengarri batera eramatea.

## Teknologiak

C# · .NET · OOP (klaseak, getter/setter-ak, modulartasuna) · `List` ·
`Dictionary` · fitxategien kudeaketa · kontsolako interfazea.

## Kodea

- 2. bertsioa (OOP): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea-v2>
- 1. bertsioa (prozedurala): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea>

> Egoera: garapenean. v2 hazten jarraitzen du bilaketa aurreratu eta estatistika
> funtzio berriekin.
