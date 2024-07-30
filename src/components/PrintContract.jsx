import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PrintContract.css";
import { API_URL } from "../services/config";

const PrintContract = () => {
  const { contractNumber } = useParams();
  const [contract, setContract] = useState(null);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_URL}/contracts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch contracts");
      }
      const data = await response.json();

      const foundContract = data.find(
        (contract) => contract.contract_number === contractNumber
      );
      if (!foundContract) {
        throw new Error("Contract not found");
      }
      setContract(foundContract);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersons = async () => {
    try {
      const response = await fetch(`${API_URL}/client/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch persons");
      }
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchContracts();
      fetchPersons();
    }
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!contract) return <p>Contract not found</p>;

  const indebtedPerson = persons.find(
    (person) => person._id.$oid === contract.member_id.$oid
  );
  const debtors = contract.debtors.map((debtorId) =>
    persons.find((person) => person.member_id === debtorId)
  );

  console.log(debtors);

  const totalToPay = contract.months * contract.rate;

  return (
    <div>
      <div className="printcontract-header printcontract-container">
        <p>Asociatia CAR „SUD-EST” IFN</p>
        <p>Bucureşti, str.Şipcă, nr.20, sector 2, CUI 30501844</p>
        <p>Înregistrată la Judecătoria sector 2 Bucureşti nr.89/29.06.2012</p>
        <p>Banca Transilvania</p>
        <p>Cont RO42BTRLRONCRT0029936302</p>
        <p>Tel: 0799 958 138 / 0723.598.524 / 0723.598.542</p>
        <p>www.creditsudest.ro</p>
      </div>
      <h1 className="printcontract-title">CONTRACT DE ÎMPRUMUT</h1>
      <p className="printcontract-subtitle">
        Nr. <strong>{contract.contract_number}</strong> din data de{" "}
        <strong>{contract.date.$date}</strong>
      </p>
      <p className="printcontract-subtitle">
        încheiat în "Agenția Buzău" localitatea Buzău, str. Triumfului, nr 38,
        jud. Buzău, între
      </p>
      <h2 className="printcontract-section-title">PĂRȚILE CONTRACTANTE :</h2>
      <p className="printcontract-section-content">
        I. Asociatia{" "}
        <strong>
          Asociația Casa de Ajutor Reciproc a Pensionarilor (C.A.R.P.) „LOCAL”
        </strong>
        , cu sediul în mun. București, str. Șipcă, nr. 20, sector 2, constituită
        în baza Legii nr. 540/2002 cu modificările și completările ulterioare și
        înregistrată la Judecătoria sectorului 2, București, cu nr.
        168/18.12.2014, cod fiscal 34019067, reprezentată prin agent MIU ȘTEFAN,
        denumită în continuare C.A.R.P., în calitate de{" "}
        <strong>ÎMPRUMUTĂTOR</strong>, și
      </p>
      {indebtedPerson && (
        <p className="printcontract-section-content">
          II. <strong>{indebtedPerson.name.toUpperCase()}</strong>, membru C.A.R
          cu domiciliul în {indebtedPerson.city}, {indebtedPerson.address},
          posesor/aoare al/a CI seria {indebtedPerson.identity_card_series}, nr.{" "}
          {indebtedPerson.identity_card_number}, eliberată la data de{" "}
          {indebtedPerson.provided_on} de către {indebtedPerson.provided_by},
          CNP {indebtedPerson.social_security_number}, în calitate de{" "}
          <strong>ÎMPRUMUTAT</strong>, împreună cu:
        </p>
      )}
      {debtors.map(
        (debtor, index) =>
          debtor && (
            <p key={index} className="printcontract-section-debtors">
              {index + 1}. <strong>{debtor.name.toUpperCase()}</strong>, cu
              domiciliul în {debtor.address}, posesor/aoare al/a CI seria{" "}
              {debtor.identity_card_series}, nr. {debtor.identity_card_number},
              eliberată la data de {debtor.provided_on} de către{" "}
              {debtor.provided_by}, CNP {debtor.social_security_number}, în
              calitate de <strong>CODEBITOR</strong>
            </p>
          )
      )}

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">
          Art.1. Obiectul Contractului
        </h2>
        <p className="printcontract-section-content">
          C.A.R.P. acordă ÎMPRUMUTATULUI un împrumut de tipul{" "}
          {contract.contract_model} în valoare totală de {contract.value} lei,
          rambursabil prin sume lunare, egale și consecutive, conform graficului
          de rambursare, pe durata de {contract.months} luni, începând cu luna
          următoare datei încheierii prezentului contract.
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">
          Art.2. Eliberarea împrumutului
        </h2>
        <p className="printcontract-section-content">
          Împrumutul se pune la dispoziţia ÎMPRUMUTATULUI integral la data de{" "}
          {contract.date.$date}, în numerar prin agent (teritorial), sau prin
          virament, în contul bancar indicat de împrumutat, după reținerea
          tarifului de înscriere în asociație și a fondului social ( după caz ).
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">
          Art.3. Preţul împrumutului şi dobânda anuală efectivă (DAE)
        </h2>
        <p className="printcontract-section-content">
          <strong>3.1</strong> Împrumutul se acordă cu o rată fixă a dobânzii
          (remuneratorii) de <strong>{contract.remunerative_interest}%</strong>
          pe an aplicată la sold (debit principal): sumele de rambursat și
          scadențele lunare se regăsesc în graficul de rambursare anexat.
          <br />
          Formula de calcul a dobânzii remuneratorii lunare este : Dobânda
          remuneratorie lunară = Soldul lunii precedente x{" "}
          <strong>{contract.remunerative_interest}% / 12</strong>
        </p>
        <p className="printcontract-section-content">
          <strong>3.2</strong> Dobânda remuneratorie se calculează de la data
          acordării împrumutului, exclusiv, până la data rambursării integrale a
          acestuia, exclusiv.
        </p>
        <p className="printcontract-section-content">
          <strong>3.3</strong> Dobânda anuală efectivă (DAE) la data semnării
          prezentului contract este de <strong>{contract.ear}%</strong> pe an,
          calculată în ipoteza că un an are 12 luni egale.
        </p>
        <p className="printcontract-section-content">
          <strong>3.4</strong> Suma totală plătibilă de ÎMPRUMUTAT calculată la
          data semnării prezentului contract este în valoare de{" "}
          <strong>{totalToPay}</strong> lei şi este formată din: împrumut (debit
          principal) în valoare de <strong>{contract.value}</strong> lei plus
          dobânda totală în valoare de{" "}
          <strong>{totalToPay - contract.value}</strong> lei.
        </p>
        <p className="printcontract-section-content">
          <strong>3.5</strong> În cazul rambursării unor sume mai mici și / sau
          dupa scadenţele stabilite în graficul de rambursare, ÎMPRUMUTATUL se
          obligă să plătească o dobândă penalizatoare (ca preț al folosinței
          capitalului împrumutat, pentru timpul de după scadențe), cu o rată
          fixă de{" "}
          <strong>
            {contract.remunerative_interest + contract.daily_penalty}%
          </strong>{" "}
          pe an aplicată la principalul restant, proporțional cu numărul de
          zile.
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">
          Art.4. Rambursarea împrumutului
        </h2>
        <p className="printcontract-section-content">
          <strong>4.1</strong> ÎMPRUMUTATUL se obligă să ramburseze împrumutul
          primit, în numerar la casier (agent) sau prin virament bancar în
          contul indicat în antet; sumele de rambursat și scadențele lunare se
          regăsesc în graficul de rambursare anexat.
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">
          Art.5. Garantarea împrumutului
        </h2>
        <p className="printcontract-section-content">
          <strong>5.1</strong> Rambursarea împrumutului și dobânzilor conform
          prezentului contract este garantată prin:
          <ul>
            <li>
              veniturile împrumutatului și ale codebitorilor, obţinute sub orice
              formă;
            </li>
            <li>
              fondul social al împrumutatului și al codebitorilor - constituit
              la C.A.R.P.;
            </li>
            <li>
              orice drepturi aflate în patrimoniul împrumutatului şi
              codebitorilor, în prezent și în viitor.
            </li>
          </ul>
        </p>
        <p className="printcontract-section-content">
          <strong>5.2</strong> ÎMPRUMUTATUL și codebitorii se obligă să nu
          înstrăineze / să nu folosească garanţiile menţionate pentru garantarea
          oricărei obligaţii către un alt împrumutător până la rambursarea
          integrală a obligațiilor ce rezultă din prezentul contract.
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">
          Art.6. Obligații și drepturi
        </h2>
        <p className="printcontract-section-content">
          <strong>6.1</strong> ÎMPRUMUTATUL are dreptul:
          <ul>
            <li>
              {" "}
              să primească, la cerere, situaţia plăţilor efectuate şi a restului
              de plată;
            </li>
            <li>
              {" "}
              să achite împrumutul înainte de termen; in acest caz se percepe
              dobânda proporțional cu numărul de zile.
            </li>
          </ul>
        </p>
        <p className="printcontract-section-content">
          <strong>6.2</strong> CODEBITORII au dreptul să primească, la cerere,
          situația plăților și a restului de plată.
        </p>
        <p className="printcontract-section-content">
          <strong>6.3</strong> ÎMPRUMUTATUL se obligă:
          <ul>
            <li>
              {" "}
              să ramburseze împrumutul și dobânda remuneratorie conform
              graficului de rambursare.
            </li>
            <li>
              {" "}
              să platească dobânda penalizatoare, calculată conform art. 3.5.
            </li>
            <li> să plătească cheltuielile generate de executarea silită.</li>
            <li>
              {" "}
              să comunice către C.A.R.P. orice schimbare intervenită privind
              domiciliul, locul de muncă, actul de identitate, nivelul
              veniturilor realizate, nr. telefon, fax, e-mail.
            </li>
          </ul>
        </p>
        <p className="printcontract-section-content">
          <strong>6.4</strong> CODEBITORII se obligă să plătească în mod
          independent, indivizibil şi solidar cu împrumutatul obligațiile
          acestuia cuprinse în art. 6.3.
        </p>
        <p className="printcontract-section-content">
          <strong>6.5</strong> C.A.R.P. are dreptul:
          <ul>
            <li>
              {" "}
              să încaseze de la ÎMPRUMUTAT și codebitori ratele împrumutului,
              dobânzile (remuneratorii și penalizatoare) aferente împrumutului,
              precum și cheltuielile generate de executarea silită, conform art.
              6.3.
            </li>
            <li>
              {" "}
              să rezilieze unilateral contractul de împrumut printr-o adresă
              scrisă, fără preaviz sau altă formalitate în situaţia în care se
              înregistrează o întârziere de rambursare a împrumutului mai mare
              de 90 de zile și să declare împrumutul scadent anticipat.
              Rezilierea acţionează de deplin drept fără a fi necesară punerea
              în întârziere a împrumutatului şi fără orice altă formalitate
              prealabilă. La data rezilierii contractului de împrumut, toate
              obligațiile privind rambursarea împrumutului devin exigibile.
            </li>
            <li>
              {" "}
              să rezilieze unilateral contractul de împrumut dacă
              împrumutatul/codebitorii au furnizat date nereale pentru obţinerea
              împrumutului.
            </li>
          </ul>
          <p className="printcontract-section-content">
            <strong>6.6</strong> C.A.R.P. se obligă:
            <ul>
              <li>
                {" "}
                să informeze ÎMPRUMUTATUL/CODEBITORII la cerere, privind
                situaţia rambursarilor;
              </li>
              <li>
                {" "}
                să notifice ÎMPRUMUTATUL și codebitorii în cazul unei întârzieri
                în rambursarea împrumutului mai mari de 60 de zile sau în cazul
                ajungerii la termen.
              </li>
            </ul>
          </p>
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">Art.7. Litigii</h2>
        <p className="printcontract-section-content">
          <strong>7.1</strong> Orice neînţelegere rezultată din prezentul
          contract va fi soluţionată pe cale amiabilă.
        </p>
        <p className="printcontract-section-content">
          <strong>7.2</strong> În cazul unui dezacord, litigiul va fi soluţionat
          de instanţa civilă competentă.
        </p>
      </div>

      <div className="printcontract-fragment">
        <h2 className="printcontract-section-title">Art.8. Alte clauze</h2>
        <p className="printcontract-section-content">
          <strong>8.1</strong> O întârziere mai mare de 90 de zile în
          rambursarea împrumutului poate conduce la executarea silită.
        </p>
        <p className="printcontract-section-content">
          <strong>8.2</strong> C.A.R.P. poate cere executarea silită, după
          notificarea împrumutatului și codebitorilor.
        </p>
        <p className="printcontract-section-content">
          <strong>8.3</strong> Prezentarea unor date neadevărate de către
          împrumutat/codebitori, în scopul încheierii prezentului contract,
          poate atrage răspunderea penală a acestuia/acestora.
        </p>
        <p className="printcontract-section-content">
          <strong>8.4</strong> ÎMPRUMUTATUL și codebitorii își exprimă acordul
          ca sumele încasate de C.A.R.P. să stingă creanţele în următoarea
          ordine: 1- cheltuieli generate de executarea silită; 2 - dobânzi
          penalizatoare; 3 - dobânzi remuneratorii; 4 - capital împrumutat
          (debit principal).
        </p>
        <p className="printcontract-section-content">
          <strong>8.5</strong> Nesolicitarea de către C.A.R.P. a oricărui drept
          prevăzut în prezentul contract nu constituie o renunţare la acest
          drept, iar C.A.R.P. va putea uza de el oricând până la stingerea
          tuturor obligaţiilor ÎMPRUMUTATULUI.
        </p>
        <p className="printcontract-section-content">
          <strong>8.6</strong> Împrumutatul și codebitorii au fost informați
          despre necesitatea prelucrării datelor cu caracter personal (nume,
          prenume, CNP, adresa, situație financiară) de catre Asociatia Casa de
          Ajutor Reciproc a Pensionarilor (C.A.R.P.) „LOCAL” direct sau prin
          intermediul împuterniciţilor desemnaţi de către aceasta, în scopul
          derulării raporturilor juridice dintre părţi, inclusiv în scopul
          alcătuirii evidenţelor aferente.
        </p>
        <p className="printcontract-section-content">
          <strong>8.7</strong> Prezentul contract constituie titlu executoriu
          conform legii 122/1996, actualizată.
        </p>
        <p className="printcontract-section-content">
          <strong>8.8</strong> Modificarea clauzelor prezentului contract se
          poate face numai cu acordul tuturor părților contractante.
        </p>
        <p className="printcontract-section-content">
          <strong>8.9</strong> Prezentul contract (împreună cu anexa 1 - grafic
          de rambursare), a fost încheiat conform art. 2, alin. 5 din Directiva
          2008/48/CE și art. 5 din OUG 50/2010 actualizată (privind contractele
          de credit pentru consumatori), Codului Civil și Codului de procedură
          civilă. Prezentul contract, citit și aprobat de toate părțile
          contractante, a fost încheiat astăzi,{" "}
          <strong>{contract.date.$date}</strong> în 5 exemplare, fiecărei părţi
          semnatare revenindu-i câte un exemplar.
        </p>
      </div>

      <hr></hr>

      <div className="printcontract-signatures">
        <div className="printcontract-signature">
          <p>ÎMPRUMUTĂTOR</p>
          <p>
            Asociatia Casa de Ajutor Reciproc a Pensionarilor( C.A.R.P. )„LOCAL”
            Agent, <strong>MIU STEFAN</strong>
          </p>
        </div>
        <div className="printcontract-signature">
          <p>ÎMPRUMUTAT</p>
          <p>am primit un exemplar</p>
          <p>
            {indebtedPerson && (
              <strong>{indebtedPerson.name.toUpperCase()}</strong>
            )}
          </p>
        </div>
        {debtors.map((debtor, index) => (
          <div key={index} className="printcontract-signature">
            <p>CODEBITOR</p>
            <p>am primit un exemplar</p>
            <p>{debtor && <strong>{debtor.name.toUpperCase()}</strong>}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintContract;
