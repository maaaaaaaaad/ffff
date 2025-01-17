import { MemberUseCaseInterface } from '@/application/use_cases/member/member.use.case.interface';
import { Member } from '@/domain/entities/member/member';

describe('member use case interface', () => {
    let application: MemberUseCaseInterface;
    const mock_member = new Member(
        'mock_uuid',
        'mock_email@gmail.com',
        'mock_password',
        0,
        new Date(),
        new Date(),
        null,
    );
    beforeEach(() => {
        application = {
            signUp: jest
                .fn()
                .mockImplementation(async (email: string, password: string) => {
                    if (email === mock_member.email)
                        throw new Error('422_email');
                    return new Member(
                        'new_uuid',
                        email,
                        password,
                        0,
                        new Date(),
                        new Date(),
                        null,
                    );
                }),
        };
    });

    describe('sign up', () => {
        it('success', async () => {
            const member = await application.signUp(
                'success@gmail.com',
                'success_password',
            );
            expect(member.id !== mock_member.id).toBeTruthy();
            expect(member.email !== mock_member.email).toBeTruthy();
            expect(member).toBeInstanceOf(Member);
            expect(member.id).toStrictEqual('new_uuid');
        });
        it('failed', async () => {
            await expect(async () => {
                await application.signUp(mock_member.email, 'password');
            }).rejects.toThrowError(new Error('422_email'));
        });
    });
});
