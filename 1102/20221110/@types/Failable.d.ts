declare type Result<R> = { isError : false; value : R };
declare type Faillure<E> = { isError : true; value : E };
declare type Failable<R,E> = Result<R> | Faillure<E>;
// typeScript 제네릭
// 선언 시점이 아니라 생성 시점에 타입을 명시해서 하나의 타입이 아닌
// 다양한 타입을 사용 할수 있는 기법이다.

// 제네릭을 왜 써야하냐
// 한번의 선언으로 다양한 타입에 재사용이 가능하다는 장점
// 제네릭을 안쓰면 불필요한 타입 변환을 하기 때문에
// 프로그램의 성능 향상에 도움이 된다.

// 제네릭을 안쓰면 타입을 미리 지정하거나 any를 사용하면 되는데
// 타입을 미리 지정한다는건 정해진 타입을 써야하고
// any를 사용하면 자료타입을 제한할수도 없다. 어떤 데이터 타입이 반환되는지 알 수
// 없다.

type A<T> = { value : T};
type C<T,S> = { value : T|S };
// 생성을 할때 T에 타입을 전달해주면 그 타입으로 value의 타입이 정해진다.

// function B() : A<String> {
//     return { value : "sdfsdfsd"}
// }

// B라는 함수가 있고 제네릭을 사용해서 T에 String 타입을 전달했고
// A<T> 라는 타입을 반환하는 함수는 B
// 리턴 값은 객체 안에 키값은 value에 value의 타입은 String

// function B() : A<number> {
//     return { value : 15151}
// }

// function D() : C<String, number>{
//     if(true)
//     {
//         return {value : "sdfsdfsd"}
//     }else{
//         return {value : 165165}
//     }
// }

// D라는 함수가 있고 제네릭을 사용해서 C<T,S>의 T랑 S 생성전까지 정해지지 않은 타입
// 그래서 함수의 반환타입으로 생성할때 T에 String 그리고 S에 number 타입을 전달하고 생성 해줌으로서
// 함수가 반환하는 타입이 두가지가 될수 있다. 객체 안에 value의 타입이 문자 타입과 숫자 타입 두가자
// 타입을 가지고 반환 할수 있다.