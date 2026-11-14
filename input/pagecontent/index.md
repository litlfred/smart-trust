{% lang-fragment journey-hero.html %}

### A traveller's journey

<div markdown="0">{% lang-fragment journey-cards.html %}</div>
<br clear="all"/>

Before the journey, in the prologue, Onesa and Taifafeki join the WHO Global Digital Health Certification Network (GDHCN):
each onboards its Public Key Infrastructure, and through the GDHCN trust list each trusts the other's public keys.
Then Sefa, a traveller from Onesa, carries a verifiable International Patient Summary (IPS) signed in Onesa, falls ill in
Taifafeki, and shares it at a clinic, which checks the signature with Onesa's key from the GDHCN and gives care.

Under each picture, the boxes are this guide's ArchiMate elements: the lit ones are active in that moment, the grey ones
are not, and each opens its element. Click a picture to walk through that moment in the
[journeys viewer](en/smart-trust/journeys/smart-trust/the-travellers-journey/), or see the whole journey as
[ArchiMate](en/smart-trust/archimate/1.7.5/view/the-travellers-journey/). The boxes are cases of the figure below:
Onesa is its Country A, Taifafeki its Country B, and the GDHCN trust list is its trust anchor's list of verified keys.

<div class="stu-note" markdown="1">
**Every person in this story, and both countries, are fictional.** Sefa comes from **Onesa** (code `XXK`) and travels in
**Taifafeki** (code `XXR`): two fictional countries shared with the
[SMART Trust demo](https://github.com/litlfred/smart-trust-demo/tree/main/scenarios/countries) and the
[SMART IPS Pilgrimage guide](https://worldhealthorganization.github.io/smart-ips-pilgrimage/). Their codes are
ISO 3166-1 user-assigned codes, so they never name a real country.
</div>



{% include overview.md %}
  
  
{% include disclaimer.md %}
