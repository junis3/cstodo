import { setCstodo, setHistory } from "./file";
import getCurrentHistory from "./getCurrentHistory";


const preprocess = async () => {
    setHistory(await getCurrentHistory());
    setCstodo('XOR컵 출제하고 GYM에 올리고 에디토리얼 포스팅하기, 겨울 방학 끝나기 전까지 루비 20개 풀기, 크립토 입문, 유학 준비, LaTeX 공부, 코포 레드 따기, 앳코더 오렌지 따기, 링크컷 공부, 몰로코에서 일하기, 계절 조교 하기, 소멤 똑붙하고 XOR 문제를 푸는 다양한 테크닉 글 쓰기, 해시코드 해보기, 라왈리신처럼 문제 잘 풀기, 매일 1다이아 해결하기, CV 만들기'.split(', '));
}


preprocess();