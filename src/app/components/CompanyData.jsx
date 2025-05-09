import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const CompanyData = ({ data }) => {
  const [emails, setEmails] = useState(data.emails || []);
  const [principalEmail, setPrincipalEmail] = useState(data.email || '');

  const handleEmailChange = (index, newValue) => {
    const updated = [...emails];
    updated[index].email = newValue;

    // Se o email atual era o principal, atualizar o principal também
    if (emails[index].email === principalEmail) {
      setPrincipalEmail(newValue);
    }

    setEmails(updated);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { email: '' }]);
  };

  const handleRemoveEmail = (index) => {
    const emailToRemove = emails[index].email;
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated);

    if (emailToRemove === principalEmail) {
      setPrincipalEmail('');
    }
  };

  const definePrincipal = (email) => {
    setPrincipalEmail(email);
  };

  return (
    <div className="shadow-lg p-6 rounded-xl mt-6 bg-white border border-gray-200">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Dados da Empresa</h2>

        <div className="text-lg space-y-2">
          <p><strong>Nome:</strong> {data.name}</p>
          <p><strong>CNPJ:</strong> {data.documents[0]?.number}</p>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Emails Registrados:</p>

          <div className="flex flex-col gap-4">
            {emails.map((emailObj, index) => {
              const isPrincipal = emailObj.email === principalEmail;

              return (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="email"
                    value={emailObj.email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      isPrincipal ? 'border-yellow-500 ring-yellow-300' : 'border-gray-300 ring-blue-500'
                    }`}
                    placeholder="exemplo@empresa.com"
                  />

                  <button
                    onClick={() => definePrincipal(emailObj.email)}
                    className={`text-yellow-500 hover:text-yellow-600 transition`}
                    title="Definir como principal"
                  >
                    {isPrincipal ? <StarIcon /> : <StarBorderIcon />}
                  </button>

                  <button
                    onClick={() => handleRemoveEmail(index)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Remover Email"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddEmail}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <AddIcon /> Adicionar Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyData;
