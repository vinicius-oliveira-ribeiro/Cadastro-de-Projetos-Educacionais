# Importando as bibliotecas necessárias
import tkinter as tk
from tkinter import messagebox

# Classe para representar um projeto educacional
class Projeto:
    # Construtor do projeto
    def __init__(self, projeto, serie, professor, descricao):
        # Atributos do projeto
        self.projeto = projeto # nome do projeto
        self.serie = serie # série escolar do projeto
        self.professor = professor # nome do professor responsável pelo projeto
        self.descricao = descricao # descrição do projeto

    # Método para imprimir os dados do projeto
    def imprimir_projeto(self):

        print("Projeto:", self.projeto)
        print("Série:", self.serie)
        print("Professor:", self.professor)
        print("Descrição:", self.descricao)

# Classe para gerenciar um cadastro de projetos educacionais
class Cadastro:
    # Construtor do cadastro
    def __init__(self):
        # Atributo para armazenar os projetos cadastrados
        self.projetos = []

    # Método para adicionar um novo projeto ao cadastro
    def adicionar_projeto(self, p):
        self.projetos.append(p)

    # Método para remover um projeto do cadastro pelo nome
    def remover_projeto(self, nome):

        for i in range(len(self.projetos)):
            if self.projetos[i].projeto == nome:
                self.projetos.pop(i)
                break

    # Método para buscar um projeto no cadastro pelo nome
    def buscar_projeto(self, nome):
        for p in self.projetos:
            if p.projeto == nome:
                return p
        return None

    # Método para listar todos os projetos cadastrados
    def listar_projetos(self):
        for p in self.projetos:
            p.imprimir_projeto()
            print()

# Classe para criar uma interface gráfica para o cadastro de projetos educacionais

class Interface:
    # Construtor da interface
    def __init__(self, master):
        # Criando um objeto da classe Cadastro
        self.cadastro = Cadastro()

        # Criando a janela principal
        self.master = master
        self.master.title("Cadastro de Projetos Educacionais")
        self.master.geometry("400x300")

        # Criando os widgets da interface
        self.label_projeto = tk.Label(self.master, text="Projeto:")
        self.entry_projeto = tk.Entry(self.master)
        self.label_serie = tk.Label(self.master, text="Série:")
        self.entry_serie = tk.Entry(self.master)
        self.label_professor = tk.Label(self.master, text="Professor:")

        self.entry_professor = tk.Entry(self.master)
        self.label_descricao = tk.Label(self.master, text="Descrição:")
        self.entry_descricao = tk.Entry(self.master)
        self.button_adicionar = tk.Button(self.master, text="Adicionar", command=self.adicionar)
        self.button_remover = tk.Button(self.master, text="Remover", command=self.remover)
        self.button_buscar = tk.Button(self.master, text="Buscar", command=self.buscar)
        self.button_listar = tk.Button(self.master, text="Listar", command=self.listar)

        # Posicionando os widgets na interface
        self.label_projeto.grid(row=0, column=0, sticky=tk.E)

        self.entry_projeto.grid(row=0, column=1, columnspan=3, sticky=tk.W+tk.E)
        self.label_serie.grid(row=1, column=0, sticky=tk.E)
        self.entry_serie.grid(row=1, column=1, columnspan=3, sticky=tk.W+tk.E)
        self.label_professor.grid(row=2, column=0, sticky=tk.E)
        self.entry_professor.grid(row=2, column=1, columnspan=3, sticky=tk.W+tk.E)
        self.label_descricao.grid(row=3, column=0, sticky=tk.E)
        self.entry_descricao.grid(row=3, column=1, columnspan=3, sticky=tk.W+tk.E)
        self.button_adicionar.grid(row=4, column=0, sticky=tk.W+tk.E)
        self.button_remover.grid(row=4, column=1, sticky=tk.W+tk.E)
        self.button_buscar.grid(row=4, column=2, sticky=tk.W+tk.E)

        self.button_listar.grid(row=4, column=3, sticky=tk.W+tk.E)

    # Método para adicionar um projeto ao cadastro
    def adicionar(self):
        # Obtendo os valores digitados nos campos de entrada
        projeto = self.entry_projeto.get()
        serie = self.entry_serie.get()
        professor = self.entry_professor.get()
        descricao = self.entry_descricao.get()

        # Verificando se os campos não estão vazios
        if projeto and serie and professor and descricao:
            # Criando um objeto da classe Projeto
            p = Projeto(projeto, serie, professor, descricao)

            # Adicionando o projeto ao cadastro

            self.cadastro.adicionar_projeto(p)

            # Mostrando uma mensagem de sucesso
            messagebox.showinfo("Sucesso", "Projeto adicionado com sucesso")

            # Limpando os campos de entrada
            self.entry_projeto.delete(0, tk.END)
            self.entry_serie.delete(0, tk.END)
            self.entry_professor.delete(0, tk.END)
            self.entry_descricao.delete(0, tk.END)
        else:
            # Mostrando uma mensagem de erro
            messagebox.showerror("Erro", "Preencha todos os campos")

    # Método para remover um projeto do cadastro
    def remover(self):
        # Obtendo o valor digitado no campo de entrada do projeto

        projeto = self.entry_projeto.get()

        # Verificando se o campo não está vazio
        if projeto:
            # Removendo o projeto do cadastro
            self.cadastro.remover_projeto(projeto)

            # Mostrando uma mensagem de sucesso
            messagebox.showinfo("Sucesso", "Projeto removido com sucesso")

            # Limpando os campos de entrada
            self.entry_projeto.delete(0, tk.END)
            self.entry_serie.delete(0, tk.END)
            self.entry_professor.delete(0, tk.END)
            self.entry_descricao.delete(0, tk.END)
        else:
            # Mostrando uma mensagem de erro
            messagebox.showerror("Erro", "Digite o nome do projeto que deseja remover")

    # Método para buscar um projeto no cadastro
    def buscar(self):
        # Obtendo o valor digitado no campo de entrada do projeto
        projeto = self.entry_projeto.get()

        # Verificando se o campo não está vazio
        if projeto:
            # Buscando o projeto no cadastro
            p = self.cadastro.buscar_projeto(projeto)

            # Verificando se o projeto foi encontrado
            if p != None:
                # Mostrando os dados do projeto nos campos de entrada
                self.entry_serie.insert(0, p.serie)
                self.entry_professor.insert(0, 

p.professor)
                self.entry_descricao.insert(0, p.descricao)
            else:
                # Mostrando uma mensagem de erro
                messagebox.showerror("Erro", "Projeto não encontrado")
        else:
            # Mostrando uma mensagem de erro
            messagebox.showerror("Erro", "Digite o nome do projeto que deseja buscar")

    # Método para listar todos os projetos cadastrados
    def listar(self):
        # Listando os projetos cadastrados no console
        self.cadastro.listar_projetos()

# Criando a janela principal
root = tk.Tk()


# Criando um objeto da classe Interface
interface = Interface(root)

# Iniciando o loop principal da interface
root.mainloop()
