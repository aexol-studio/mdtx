/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	CreateConnection:{

	},
	AdminMutation:{
		connection:{

		},
		createConnection:{
			connection:"CreateConnection"
		}
	},
	Mutation:{
		login:{
			user:"LoginInput"
		},
		register:{
			user:"RegisterInput"
		}
	},
	CreateRepository:{

	},
	UpdateConnection:{

	},
	RepositoryOps:{
		update:{
			repository:"UpdateRepository"
		}
	},
	UpdateRepository:{

	},
	ConnectionOps:{
		addRepository:{
			repository:"CreateRepository"
		},
		repository:{

		},
		update:{
			connection:"UpdateConnection"
		}
	},
	LoginInput:{

	},
	RegisterInput:{

	}
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		admin:"AdminQuery"
	},
	AdminMutation:{
		connection:"ConnectionOps",
		createConnection:"String"
	},
	Repository:{
		_id:"String",
		connection:"Connection",
		createdAt:"String",
		updatedAt:"String",
		uri:"String"
	},
	Mutation:{
		admin:"AdminMutation",
		login:"String",
		register:"String"
	},
	Connection:{
		_id:"String",
		applicationId:"String",
		createdAt:"String",
		name:"String",
		owner:"String",
		repositiories:"Repository",
		service:"String",
		token:"String",
		updatedAt:"String",
		url:"String"
	},
	RepositoryOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	Node:{
		"...on Repository": "Repository",
		"...on Connection": "Connection",
		createdAt:"String",
		updatedAt:"String",
		_id:"String"
	},
	ConnectionOps:{
		addRepository:"String",
		delete:"Boolean",
		repository:"RepositoryOps",
		update:"Boolean"
	},
	AdminQuery:{
		connections:"Connection"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}