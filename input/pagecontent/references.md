
 

  
### Trust Network Specifications
 
<a name="trust-specfications"> </a>


  
  
#### EU DCC 

  
<!-- references:begin style=ul keys=ehn-trust-framework-2021,ehn-dcc-techspec-vol1-2021,etsi-en-319-102-1-2016,ec-dcc-techspec-vol1-5,ec-dcc-vol1-2022,eu-implementing-decision-2021-1073 -->
<ul>
  <li id="ref-ehn-trust-framework-2021" data-ref="ehn-trust-framework-2021">eHealth Network. <a href="https://ec.europa.eu/health/sites/health/files/ehealth/docs/trust-framework_interoperability_certificates_en.pdf">Interoperability of health certificates – Trust Framework</a>. Version 1.0. 12 March 2021. Last accessed 27 April 2021.</li>
  <li id="ref-ehn-dcc-techspec-vol1-2021" data-ref="ehn-dcc-techspec-vol1-2021">eHealth Network. <a href="https://ec.europa.eu/health/sites/health/files/ehealth/docs/digital-green-certificates_v1_en.pdf">Technical Specifications for Digital COVID Certificates Volume 1</a>. Version V1.0.5. Last accessed 27 April 2021.</li>
  <li id="ref-etsi-en-319-102-1-2016" data-ref="etsi-en-319-102-1-2016"><a href="https://www.etsi.org/deliver/etsi_en/319100_319199/31910201/01.01.01_60/en_31910201v010101p.pdf">ETSI EN 319 102-1: Electronic Signatures and Infrastructures (ESI); Procedures for Creation and Validation of AdES Digital Signatures; Part 1: Creation and Validation</a>. Version 1.1.1. 2016. Last accessed 23 April 2021.</li>
  <li id="ref-ec-dcc-techspec-vol1-5" data-ref="ec-dcc-techspec-vol1-5"><a href="https://health.ec.europa.eu/publications/technical-specifications-eu-digital-covid-certificates-volumes-1-5_en">Technical specifications for EU Digital COVID Certificates - Volumes 1-5</a>.</li>
  <li id="ref-ec-dcc-vol1-2022" data-ref="ec-dcc-vol1-2022"><a href="https://health.ec.europa.eu/system/files/2022-02/digital-covid-certificates_v1_en.pdf">Volume 1: Formats and trust management</a>. References “Implementing Decision (EU) 2021/1073, Annex I”.</li>
  <li id="ref-eu-implementing-decision-2021-1073" data-ref="eu-implementing-decision-2021-1073"><a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv%3AOJ.L_.2021.230.01.0032.01.ENG">Implementing Decision (EU) 2021/1073, Annex I</a>. Found along with other relevant Annexes.</li>
</ul>
<!-- references:end -->


  
####  DIVOC 

  
<ul>
    <li>Elements are defined by JSON-LD. As of 2023-02-12, the most current <a href="https://github.com/egovernments/DIVOC/blob/icmr/vaccination-context/vaccination-context.js">JSON-LD context for vaccines</a> and for <a href="https://github.com/egovernments/DIVOC/blob/icmr/test-certificate-context/test-certificate-context.js">test results</a> is here . Note that the URIs for the DIVOC-specific JSON-LD contexts embedded in the certificates do not resolve.</li>
    <li> DIVOC's <a href="https://divoc.digit.org">documentation</a> is here  but this does not include element-level descriptions (e.g., terminology bindings at a per-element level).</li>
    <li> Terminology bindings at the element level must be inferred from more <a href="https://divoc.digit.org/platform/divocs-verifiable-certificate-features/what-information-goes-into-a-qr-code">general documentation</a>.  The `v2` JSON-LD context introduces the `evidence.icd11Code` element for vaccines, but there is no documentation on which codes this element is bound to or whether this is used in production. There is no other computable representation of vaccine type/product.</li>
  </ul>


  
#### ICAO 

  
<!-- references:begin style=ul keys=icao-vds-nc -->
<ul>
  <li id="ref-icao-vds-nc" data-ref="icao-vds-nc">ICAO. <a href="https://www.icao.int/vdsnc-spec">VDS NC</a>.</li>
</ul>
<!-- references:end -->


  
#### SMART Health Cards 

  
<!-- references:begin style=ul keys=smart-health-cards-spec,hl7-shc-vaccination-ig -->
<ul>
  <li id="ref-smart-health-cards-spec" data-ref="smart-health-cards-spec"><a href="https://spec.smarthealth.cards">General SMART Health Card specification</a>.</li>
  <li id="ref-hl7-shc-vaccination-ig" data-ref="hl7-shc-vaccination-ig"><a href="http://build.fhir.org/ig/HL7/fhir-shc-vaccination-ig">COVID-19 vaccine and testing-specific specification</a>.</li>
</ul>
<!-- references:end -->

    

  
  
#### WHO SMART Guideline Development 
  
<a name="smart-guidelines"> </a>

  
<!-- references:begin style=ul keys=who-smart-guidelines,who-guideline-handbook -->
<ul>
  <li id="ref-who-smart-guidelines" data-ref="who-smart-guidelines">World Health Organization. <a href="https://www.who.int/teams/digital-health-and-innovation/smart-guidelines">SMART Guidelines</a>. Overviews the SMART Guidelines approach.</li>
  <li id="ref-who-guideline-handbook" data-ref="who-guideline-handbook">World Health Organization. <a href="https://www.who.int/publications/i/item/9789241548960">Handbook for guideline development</a>. Provides an overview of the WHO guideline development and publication process.</li>
</ul>
<!-- references:end -->



  
