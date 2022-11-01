import Image from 'next/image';
import { FormEvent, useState } from 'react';
import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import iconCheckImage from '../assets/icon-check.svg';
import logoImage from '../assets/logo.svg';
import usersAvatarExampleImage from '../assets/users-avatar-examples.png';
import { api } from '../lib/axios';

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home({
  poolsCount: serverPoolsCount,
  guessesCount,
  usersCount
}: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');
  const [poolsCount, setPoolsCount] = useState(serverPoolsCount);

  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        'Bolão criado com sucesso! O código foi copiado para a área de transferência.'
      );

      setPoolTitle('');
      setPoolsCount(cnt => cnt + 1);
    } catch (err) {
      alert('Falha ao criar o bolão. Tente novamente!');
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImage} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImage} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form className="flex mt-10 gap-2" onSubmit={createPool}>
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100 text-sm"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que
          <br />
          poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('http://localhost:3333/pools/count'),
      api.get('http://localhost:3333/guesses/count'),
      api.get('http://localhost:3333/users/count')
    ]);

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    },
    revalidate: 60
  };
};
