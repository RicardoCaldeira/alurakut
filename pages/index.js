import React from 'react';
import MainGrid from '../src/components/MainGrid/index';
import Box from '../src/components/Box/index';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(propriedades) {
	return (
		<Box>
			<img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }}/>
			<hr />

			<p>
				<a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>@{propriedades.githubUser}</a>
			</p>
			<hr />

			<AlurakutProfileSidebarMenuDefault />
			
		</Box>
	)
}

function ProfileRelationsBox(propriedades) {
	return (
		<ProfileRelationsBoxWrapper>
			<h2 className="smallTitle">{propriedades.title} ({propriedades.itens.length})</h2>
			<ul>
				{propriedades.itens.slice(0, 6).map((itemAtual) => {
					return (
						<li key={itemAtual.id}>
							<a href={itemAtual.url}>
								<img src={itemAtual.avatar_url}/>
								<span>{itemAtual.login}</span>
							</a>
						</li>
					)
				})}
			</ul>
		</ProfileRelationsBoxWrapper>
	)
}

export default function Home() {
	const githubUser = "RicardoCaldeira";
	const [comunidades, setComunidades] = React.useState([]);
	const pessoasFavoritas = [
		'juunegreiros',
		'omariosouto',
		'peas',
		'rafaballerini',
		'marcobrunodev',
		'felipefialho'
	]

	const [seguidores, setSeguidores] = React.useState([]);

	React.useEffect(function() {

		// GET
		fetch('https://api.github.com/users/peas/followers')
		.then(function(respostaDoServidor) {
			return respostaDoServidor.json();
		})
		.then (function(respostaCompleta) {
			setSeguidores(respostaCompleta);
			console.log(respostaCompleta);
		})

		// API GraphQL
		fetch('https://graphql.datocms.com/', {
			method: 'POST',
			headers: {
				'Authorization': '1ce86879b6a8f9111d9ebdcd29816d',
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({ "query": `query {
				allCommunities {
				  id
				  title
				  imageUrl
				  creatorSlug
				}
			  }`
			})
		})
		.then((response) => response.json())
		.then((respostaCompleta) => {
			const comunidadesDato = respostaCompleta.data.allCommunities;
			setComunidades(comunidadesDato);
			console.log(comunidades);
		})

	}, []) /* array vazio passado para indicar que o useEffect é p/ ser executado somente 1 vez, caso nao passe um array ele será executado sempre que houver uma alteração na pagina.
	pode-se também passar variaveis(states) dentro do array para indicar que o useEffect deve ser executado sempre que essas variaveis forem alteradas */

	return (
		<>
			<AlurakutMenu githubUser={githubUser}/>
			<MainGrid>
				{}
				<div className="profileArea" style={{ gridArea: 'profileArea' }}>
					<ProfileSideBar githubUser={githubUser} />
				</div>

				<div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
					<Box>
						<h1 className="title">
							Bem vindo(a)
						</h1>
						<OrkutNostalgicIconSet />
					</Box>

					<Box>
						<h2 className="subTitle">O que você deseja fazer?</h2>
						<form onSubmit={(e) => {
							e.preventDefault(); // para nao atualizar a página
							const dadosForm = new FormData(e.target);

							const comunidade = {
								id: new Date().toISOString(),
								title: dadosForm.get('title'),
								image: dadosForm.get('image')
							}

							console.log(dadosForm);
							console.log(comunidade);

							setComunidades([...comunidades, comunidade])
						}}>
							<div>
								<input 
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
								/>
							</div>
							<div>
								<input 
									placeholder="Coloque uma URL para usarmos de capa"
									name="image"
									aria-label="Coloque uma URL para usarmos de capa"
									type="text"
								/>
							</div>
							<button>
								Criar comunidade
							</button>
						</form>
					</Box>
				</div>

				<div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Pessoas da comunidade ({pessoasFavoritas.length})</h2>

						<ul>
							{pessoasFavoritas.map((itemAtual) => {
								return (
									<li key={itemAtual}>
										<a href={`/users/${itemAtual}`}>
											<img src={`https://github.com/${itemAtual}.png`} />
											<span>{itemAtual}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>

					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Minhas comunidades ({comunidades.length})</h2>
						<ul>
							{comunidades.map((itemAtual) => {
								return (
									<li key={itemAtual.id}>
										<a href={`/communities/${itemAtual.id}`}>
											<img src={itemAtual.imageUrl}/>
											<span>{itemAtual.title}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>

					<ProfileRelationsBox title='Seguidores' itens={seguidores} />

				</div>

			</MainGrid>
		</>
	)
}