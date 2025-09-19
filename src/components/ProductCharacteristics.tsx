const ProductCharacteristics = () => {
  const characteristics = [
    { label: 'Gêneros', value: 'Plataforma' },
    { label: 'Temáticas', value: '' },
    { label: 'Modo de Jogo', value: '' },
    { label: 'Franquia', value: '' },
    { label: 'Tipo de Cartucho', value: '' },
    { label: 'Estado de Preservação', value: '' },
    { label: 'Região', value: '' },
    { label: 'Idiomas do Áudio', value: '' },
    { label: 'Idiomas da Legenda', value: '' },
    { label: 'Idiomas da Interface', value: '' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 ">
      <h2 className="text-xl font-semibold mb-6">Características do produto</h2>
      <div>
        <h3 className="text-lg mb-4">Detalhes técnicos</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden w-1/2">
          {characteristics.map((item, index) => (
            <div
              key={item.label}
              className={`flex p-4 py-2 ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
            >
              <div className="w-1/2 font-semibold text-gray-800">{item.label}:</div>
              <div className="w-1/2 text-gray-600">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCharacteristics;