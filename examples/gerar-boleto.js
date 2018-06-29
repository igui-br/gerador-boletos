const Gerador = require('../index');
const fs = require('fs');
// const WritableBufferStreamFactory = require('./stream');

console.log('run gerar boletos!!');

const init = () => {
  const boleto = createBoleto();
  const writeStream = fs.createWriteStream('meuBoleto.pdf');
  // const writeStream = WritableBufferStreamFactory();

  new Gerador.boleto.Gerador(boleto).gerarPDF({
    creditos: '',
    stream: writeStream
  }, (err, pdf) => {
    if (err) return console.error(err);

    writeStream.on('finish', () => {
      console.log('written!');
      // if (toBase64) {
      //   const pdfBase64 = writeStream.toBuffer().toString('base64')
      //   resolve(pdfBase64);
      // } else {
      //   resolve(writeStream.toBuffer());
      // }
    });
  });
}

const createBoleto = () => {
  const Datas = Gerador.boleto.Datas;
  const bancos = Gerador.boleto.bancos;
  const pagador = createPagador();
  const beneficiario = createBeneficiario();
  const instrucoes = createInstrucoes();

  return Gerador.boleto.Boleto.novoBoleto()
    .comDatas(Datas.novasDatas()
      .comVencimento('15', '08', '2018')
      .comProcessamento('14', '07', '2017')
      .comDocumento('14', '07', '2017'))
    .comBeneficiario(beneficiario)
    .comPagador(pagador)
    .comBanco(new bancos.Bradesco())
    .comValorBoleto(210.15) //Apenas duas casas decimais
    .comNumeroDoDocumento(1001)
    .comEspecieDocumento('DM') //Duplicata de Venda Mercantil
    .comLocaisDePagamento(['Em qualquer banco até o vencimento'])
    .comInstrucoes(instrucoes);
}

const createPagador = () => {
  const enderecoPagador = Gerador.boleto.Endereco.novoEndereco()
    .comLogradouro('Rua Pedro Lessa, 15')
    .comBairro('Centro')
    .comCidade('Rio de Janeiro')
    .comUf('RJ')
    .comCep('20030-030')

  return Gerador.boleto.Pagador.novoPagador()
    .comNome('José Bonifácio de Andrada')
    .comRegistroNacional('72285732503')
    .comEndereco(enderecoPagador)
}

const createBeneficiario = () => {
  const enderecoBeneficiario = Gerador.boleto.Endereco.novoEndereco()
    .comLogradouro('Rua da Consolação, 1500')
    .comBairro('Consolação')
    .comCidade('São Paulo')
    .comUf('SP')
    .comCep('01301100')

  return Gerador.boleto.Beneficiario.novoBeneficiario()
    .comNome('Empresa Fictícia LTDA')
    .comRegistroNacional('43576788000191')
    .comCarteira('009')
    .comAgencia('0101')
    .comDigitoAgencia('5')
    .comCodigoBeneficiario('326446')
    .comDigitoCodigoBeneficiario('0')
    .comNossoNumero('12950000000000061')
    .comDigitoNossoNumero('8')
    .comEndereco(enderecoBeneficiario);
}

const createInstrucoes = () => {
  const instrucoes = [];
  instrucoes.push(`Após o vencimento Mora dia R$ 1,59`);
  instrucoes.push(`Após o vencimento, multa de 2%`);
  return instrucoes;
}

init();
