import math
import random


def calc_key():
    return math.floor(random.random() * 1000000)


class KeyHandler:
    dict = {}

    def __init__(self):
        None

    # generates a one-time key matching a filename
    def assign_key(self, name):
        key = calc_key()
        while self.dict[key] is not None:
            key = calc_key()
        self.dict[key] = name
        return key

    # uses up the key matching a filename and deletes it
    def use_key(self, key):
        name = self.dict[key]
        if name is None:
            return None
        del self.dict[key]
        return name
