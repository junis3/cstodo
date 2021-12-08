import { emoji } from '../etc/theme';
import isAttack from './isAttack';

test("isAttack length under < 10000", () => {
    expect(isAttack({
        type: 'message',
        channel: 'testChannel',
        user: 'testUser',
        ts: '1234',
        text: 'sample short text'
    })).toBe(undefined);
});

test("isAttack length  == 10000", () => {
    expect(isAttack({
        type: 'message',
        channel: 'testChannel',
        user: 'testUser',
        ts: '1234',
        text: 'x'.repeat(10000)
    })).toBe(undefined);
});

test("isAttack length over 10000", () => {
    const command = isAttack({
        type: 'message',
        channel: 'testChannel',
        user: 'testUser',
        ts: '1234',
        text: 'x'.repeat(10001)
    });
    
    expect(command).not.toBe(undefined);
    expect(command?.muted).toBe(false);
    expect(command?.options).toBe(undefined);
    expect(command?.user).toBe('testUser');
    expect(command?.channel).toBe('testChannel');
    expect(command?.ts).toBe('1234');
    expect(command?.props).toStrictEqual({
        text: emoji('fuck'),
        channel: 'testChannel',
        icon_emoji: emoji('fuck'),
    });
});
