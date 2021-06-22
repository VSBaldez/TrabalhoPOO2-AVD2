import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Container, Form } from './styles'
import imagemEditar from './imagens/editar.png'
import imagemDeletar from './imagens/deletar.png'
import imagemPrincipal from './imagens/principal.png'

interface IListagem {
  id: string;
  cliente: string;
  telefone: string;
  email: string;
}

interface Cadastro {
  cliente: string;
  telefone: string;
  email: string;
}

const Dashboard: React.FC = () => {

  async function alrerarDados(id: string){
    getTitulo()
    const dados = await api.get(`/clients/${id}`).then(response => response.data)
      console.log('Dados: ', dados)
      if(dados){
        setId(dados.id)
        setCliente(dados.cliente)
        setTelefone(dados.telefone)
        setEmail(dados.email)

      } else {
        setClientes([])

      }

  }

  const [clientes, setClientes] = useState<Cadastro[]>([])
  const [clientes1, setClientes1] = useState<IListagem[]>([])
  const [titulo, setTitulo] = useState("Cadastro");

  const getTitulo = () => {
    setTitulo("Editar");
  }

  const [id, setId] = useState('')
  const [cliente, setCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    api.get('/clients').then(response => setClientes1(response.data))
   }, [])
   console.log(clientes1)

  async function handleDelete(id: string){
    await api.delete(`/clients/${id}`)
    setClientes1(clientes1.filter(cli => cli.id !== id))
  }


  async function handleAddClientes(event: any) {
    event.preventDefault()
    const { target: form } = event;
    const novoCadastro = {
      cliente: form.cliente.value,
      telefone: form.telefone.value,
      email: form.email.value,
    }
    console.log(novoCadastro);
    if(id){
      await api.put(`/clients/${id}`, novoCadastro)
      //alert('Dados alterados com sucesso.')
      api.get('/clients').then(response => setClientes1(response.data))
      setId("")
      setTitulo("Cadastro");
    } else {
      await api.post('/clients', novoCadastro)
      api.get('/clients').then(response => setClientes1(response.data))
      //alert('Cadastro realizado com sucesso.')
    }

    setCliente('')
    setTelefone('')
    setEmail('')

    setClientes([...clientes, novoCadastro])
    form.reset()

  }
  return (
    <>
    <div className="conteudo">
    <a href="../"><img alt="Principal" className="iconePrincipal" src={imagemPrincipal}/></a>
    <h1>Trabalho - POO2 - AVD2</h1>
    <div id="cadastro">
    <h2 id="titulo">{titulo}</h2>
    <Form onSubmit={handleAddClientes}>

      <input type='text' autoComplete="off" autoFocus name='cliente' value={cliente} onChange={e => setCliente(e.target.value)} placeholder='Nome do Cliente' />
      <input type='text' autoComplete="off" name='telefone' value={telefone} onChange={e => setTelefone(e.target.value)} placeholder='Telefone' />
      <input type='text' autoComplete="off" name='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='E-mail' />
      <button type='submit'>ENVIAR</button>

    </Form>
    </div>

    <div id="lista">
    <h2>Lista de Clientes</h2>
    <Container>

      <table className="table table-hover">
        <tr>
          <th>CLIENTE</th>
          <th>TELEFONE</th>
          <th>E-MAIL</th>
          <th>OPÇÕES</th>
        </tr>
        {clientes1.map((cli, indice) =>
        <tr key={indice}>
         <td >{cli.cliente.toUpperCase()}</td>
         <td>{cli.telefone.toUpperCase()}</td>
         <td>{cli.email.toUpperCase()}</td>
         <td className="opcoes" ><button type="button" onClick={() => handleDelete(cli.id)}><img alt="Deletar" className="icone" src={imagemDeletar}/></button>
              <button onClick={() => alrerarDados(cli.id)} type="button"><img alt="Editar" className="icone" src={imagemEditar}/></button></td>
        </tr>
        ).reverse()}

      </table>
    </Container>
    </div>
    </div>
</>


  )
}

export default Dashboard;
